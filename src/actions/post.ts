'use server'

import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: "Not authenticated" }

  const content = formData.get("content") as string
  const famIdsJson = formData.get("famIds") as string
  const councilId = formData.get("councilId") as string

  if (!content) return { error: "Content is required" }

  let famIds: string[] = []
  try {
    famIds = famIdsJson ? JSON.parse(famIdsJson) : []
  } catch (e) {
    return { error: "Invalid audience selection" }
  }

  // Verify membership
  if (famIds.length > 0) {
    const { count } = await supabase
      .from('fam_members')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .in('fam_id', famIds)

    // Note: This checks if user is member of ANY of the provided fams, not ALL.
    // For strictness, count should equal famIds.length (assuming no dupes).
    // Let's assume unique famIds in input.
    if ((count || 0) !== famIds.length) {
       return { error: "You are not a member of one or more selected Fams" }
    }
  }

  // 1. Create Post
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      content,
      author_id: session.user.id,
      council_id: councilId || null
    })
    .select()
    .single()

  if (error || !post) return { error: "Failed to create post" }

  // 2. Link to Fams
  if (famIds.length > 0) {
    const { error: linkError } = await supabase
      .from('post_fams')
      .insert(
        famIds.map(fid => ({
          post_id: post.id,
          fam_id: fid
        }))
      )

     if (linkError) console.error("Error linking post to fams", linkError)
  }

  // Revalidate
  famIds.forEach(id => revalidatePath(`/fams/${id}`))
  revalidatePath('/feed')

  return { success: true }
}

export async function getFeed() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { posts: [] }

  const userId = session.user.id

  // 1. Get my Fams to know context
  const { data: myMemberships } = await supabase
    .from('fam_members')
    .select('fam_id, fam:fams(owner_id)')
    .eq('user_id', userId)

  const ownedFamIds = myMemberships
    ?.filter((m: any) => m.fam.owner_id === userId)
    .map((m: any) => m.fam_id) || []

  const memberFamIds = myMemberships
    ?.filter((m: any) => m.fam.owner_id !== userId)
    .map((m: any) => m.fam_id) || []

  const allMyFamIds = [...ownedFamIds, ...memberFamIds]

  // 2. Fetch Posts
  // We want posts that are:
  // - Authored by me
  // - OR linked to one of my Fams (we will filter later)

  const { data: rawPosts } = await supabase
    .from('posts')
    .select(`
      *,
      author:users(*),
      post_fams!inner(fam_id, fam:fams(owner_id)),
      comments(*, author:users(*))
    `)
    // Filter posts that are EITHER authored by me OR in my fams.
    // Supabase OR syntax is tricky with relations.
    // Simplified: Fetch posts in my fams. My posts not in my fams (if any) are edge case (maybe public/council?).
    // Assuming all posts must be in at least one fam (or council).
    // Let's rely on post_fams filter.
    .in('post_fams.fam_id', allMyFamIds)
    .order('created_at', { ascending: false })

  // Note: If a post is in Fam A and Fam B, and I am in both, it returns once (Supabase handles it if we structure right, but relation join might duplicate rows or return array of fams).
  // With `post_fams!inner`, it filters posts that have at least one matching fam.
  // The `post_fams` field in result will contain the fams.

  // 3. Filter Asymmetric Privacy
  // Logic:
  // - If I authored it: Visible.
  // - If I own a Fam the post is in: Visible.
  // - If Author is Owner of a Fam the post is in: Visible (in context of that Fam).

  let visiblePosts = (rawPosts || []).filter((post: any) => {
    if (post.author_id === userId) return true

    // Check visibility via any of the linked fams
    return post.post_fams.some((pf: any) => {
       const famId = pf.fam_id
       // Am I a member of this fam? (Query already filtered to my fams, but safe to check)
       if (!allMyFamIds.includes(famId)) return false

       const famOwnerId = pf.fam.owner_id

       // If I am the owner of this fam, I see everything in it
       if (famOwnerId === userId) return true

       // If the author of the post is the owner of this fam, I see it
       if (famOwnerId === post.author_id) return true

       return false
    })
  })

  // Deduplicate posts (if any)
  const uniquePosts = Array.from(new Map(visiblePosts.map((p: any) => [p.id, p])).values())

  return { posts: uniquePosts }
}
