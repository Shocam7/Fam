'use server'

import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Post, Comment, FamMember } from "@/types"

export async function getFamDetails(famId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: "Not authenticated" }

  const userId = session.user.id

  // 1. Check if user is a member
  const { data: membership, error: memberError } = await supabase
    .from('fam_members')
    .select(`
      *,
      fam:fams(*)
    `)
    .eq('user_id', userId)
    .eq('fam_id', famId)
    .single()

  if (memberError || !membership) return { error: "Not a member" }

  const fam = membership.fam
  const isOwner = fam.owner_id === userId

  // 2. Fetch Members (Asymmetric Visibility)
  let members = []

  if (isOwner) {
    const { data: allMembers } = await supabase
      .from('fam_members')
      .select(`
        *,
        user:users(*)
      `)
      .eq('fam_id', famId)

    members = allMembers || []
  } else {
    // Member only sees Owner and Self
    const { data: limitedMembers } = await supabase
      .from('fam_members')
      .select(`
        *,
        user:users(*)
      `)
      .eq('fam_id', famId)
      .in('user_id', [fam.owner_id, userId]) // Filter at DB level

    members = limitedMembers || []
  }

  // 3. Fetch Posts (Asymmetric Visibility)
  // We need posts that belong to this Fam.
  // Join PostFam -> Post -> User (Author)
  // Then filter based on Author.

  const { data: postsInFam } = await supabase
    .from('post_fams')
    .select(`
      post:posts (
        *,
        author:users (*),
        comments (
          *,
          author:users (*)
        )
      )
    `)
    .eq('fam_id', famId)
    .order('post(created_at)', { ascending: false }) // Sort needs care with nested, might need manual sort or view

  // Flatten structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let posts: Post[] = postsInFam ? postsInFam.map((pf: any) => pf.post) : []

  // Sort manually if nested sort didn't work (Supabase nested sort is tricky)
  posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // Filter Posts
  if (!isOwner) {
      posts = posts.filter(post =>
          post.author_id === fam.owner_id || post.author_id === userId
      )
  }

  // Filter Comments
  if (!isOwner) {
    posts.forEach(post => {
      if (post.comments) {
        post.comments = post.comments.filter((c: Comment) =>
          c.author_id === fam.owner_id || c.author_id === userId
        )
      }
    })
  }

  return {
    fam,
    members: members as FamMember[],
    posts,
    isOwner,
    currentUserId: userId
  }
}
