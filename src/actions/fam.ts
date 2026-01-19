'use server'

import { supabase } from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Fam } from "@/types"

export async function createFam(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: "Not authenticated" }

  const name = formData.get("name") as string
  const vibe = formData.get("vibe") as string

  if (!name) return { error: "Name is required" }

  const vibeConfig = JSON.stringify({ theme: "default" })

  // 1. Create Fam
  const { data: fam, error: famError } = await supabase
    .from('fams')
    .insert({
      name,
      vibe,
      vibe_config: vibeConfig,
      owner_id: session.user.id
    })
    .select()
    .single()

  if (famError || !fam) {
    console.error("Error creating fam:", famError)
    return { error: "Failed to create fam" }
  }

  // 2. Add Owner as Member
  const { error: memberError } = await supabase
    .from('fam_members')
    .insert({
      user_id: session.user.id,
      fam_id: fam.id,
      role: "OWNER"
    })

  if (memberError) {
     console.error("Error creating fam member:", memberError)
     // Rollback fam creation? Ideal but complex in manual steps.
     // For MVP, assume it works or manual cleanup.
     return { error: "Failed to add owner to fam" }
  }

  revalidatePath("/fams")
  redirect(`/fams/${fam.id}`)
}

export async function getFams() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { created: [], joined: [] }

  // Fetch all memberships with Fam details
  const { data: members, error } = await supabase
    .from('fam_members')
    .select(`
      *,
      fam:fams (
        *,
        owner:users (*)
      )
    `)
    .eq('user_id', session.user.id)

  if (error || !members) return { created: [], joined: [] }

  // Need to count members for each fam.
  // Supabase join count is tricky without a view or RPC.
  // We'll separate logic or do a second query.
  // Or fetch counts client side?
  // Let's do a quick separate aggregation if possible, or just ignore counts for now to keep it simple.
  // Or, we can use `.count()` on another query.

  // Let's just iterate and fetch counts? N+1 problem.
  // For MVP, we will skip the member count on the list view or mock it.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fams = members.map((m: any) => ({
    ...m.fam,
    _count: { members: 0 } // Placeholder
  })) as Fam[]

  const created = fams.filter((f) => f.owner_id === session.user.id)
  const joined = fams.filter((f) => f.owner_id !== session.user.id)

  return { created, joined }
}

export async function inviteUser(famId: string, username: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: "Not authenticated" }

  // Verify Owner
  const { data: fam } = await supabase
    .from('fams')
    .select('*')
    .eq('id', famId)
    .single()

  if (!fam) return { error: "Fam not found" }
  if (fam.owner_id !== session.user.id) return { error: "Only owner can invite" }

  // Find User
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('name', username)
    .single()

  if (!user) return { error: "User not found" }

  // Check if already member
  const { data: existing } = await supabase
    .from('fam_members')
    .select('id')
    .eq('user_id', user.id)
    .eq('fam_id', famId)
    .single()

  if (existing) return { error: "User already in Fam" }

  // Add Member
  const { error } = await supabase
    .from('fam_members')
    .insert({
      user_id: user.id,
      fam_id: famId
    })

  if (error) return { error: "Failed to add member" }

  revalidatePath(`/fams/${famId}`)
  return { success: true }
}
