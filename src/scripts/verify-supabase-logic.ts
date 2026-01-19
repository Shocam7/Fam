import { supabase } from "@/lib/supabase"

// Mock the Supabase client behavior for local verification without credentials
// This script simulates the "Fam Details" privacy logic test.

// Mock Data
const users = [
  { id: 'userA', name: 'User A' },
  { id: 'userB', name: 'User B' },
  { id: 'userC', name: 'User C' }
]

const fams = [
  { id: 'fam1', name: 'Fam 1', owner_id: 'userA' }
]

const members = [
  { id: 'm1', user_id: 'userA', fam_id: 'fam1', role: 'OWNER' },
  { id: 'm2', user_id: 'userB', fam_id: 'fam1', role: 'MEMBER' },
  { id: 'm3', user_id: 'userC', fam_id: 'fam1', role: 'MEMBER' }
]

const posts = [
  { id: 'p1', content: 'A Post', author_id: 'userA', created_at: new Date().toISOString() },
  { id: 'p2', content: 'B Post', author_id: 'userB', created_at: new Date().toISOString() },
  { id: 'p3', content: 'C Post', author_id: 'userC', created_at: new Date().toISOString() }
]

const postFams = [
  { post_id: 'p1', fam_id: 'fam1' },
  { post_id: 'p2', fam_id: 'fam1' },
  { post_id: 'p3', fam_id: 'fam1' }
]

// Simulation Function
function testPrivacyLogic() {
  console.log("Starting Privacy Logic Verification...")

  // Scenario: User B views Fam 1
  const viewerId = 'userB'
  const famId = 'fam1'

  console.log(`\nScenario: ${viewerId} views ${famId}`)

  const fam = fams.find(f => f.id === famId)!
  const isOwner = fam.owner_id === viewerId

  // 1. Members Visibility Logic
  let visibleMembers = []
  if (isOwner) {
    visibleMembers = members.filter(m => m.fam_id === famId)
  } else {
    // Only Owner and Self
    visibleMembers = members.filter(m => m.fam_id === famId && (m.user_id === fam.owner_id || m.user_id === viewerId))
  }

  console.log("Visible Members:", visibleMembers.map(m => m.user_id))

  const bSeesC = visibleMembers.some(m => m.user_id === 'userC')
  if (bSeesC) {
    console.error("FAIL: User B should NOT see User C")
  } else {
    console.log("PASS: User B does not see User C")
  }

  // 2. Posts Visibility Logic
  let visiblePosts = []

  // Get all posts in fam
  const postsInFam = posts.filter(p => postFams.some(pf => pf.post_id === p.id && pf.fam_id === famId))

  if (isOwner) {
    visiblePosts = postsInFam
  } else {
    // Only Owner's posts and My posts
    visiblePosts = postsInFam.filter(p => p.author_id === fam.owner_id || p.author_id === viewerId)
  }

  console.log("Visible Posts Authors:", visiblePosts.map(p => p.author_id))

  const bSeesCPost = visiblePosts.some(p => p.author_id === 'userC')
  if (bSeesCPost) {
    console.error("FAIL: User B should NOT see User C's post")
  } else {
    console.log("PASS: User B does not see User C's post")
  }

  const bSeesAPost = visiblePosts.some(p => p.author_id === 'userA')
  if (!bSeesAPost) {
    console.error("FAIL: User B SHOULD see User A's post (Owner)")
  } else {
    console.log("PASS: User B sees User A's post")
  }
}

testPrivacyLogic()
