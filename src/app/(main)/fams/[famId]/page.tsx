
import { getFamDetails } from "@/actions/fam-details"
import { inviteUser } from "@/actions/fam"
import { redirect } from "next/navigation"

export default async function FamDetailsPage({ params }: { params: { famId: string } }) {
  const { famId } = params
  const data = await getFamDetails(famId)

  if (data.error) {
    return <div className="p-8 text-red-500">Error: {data.error}</div>
  }

  // Supabase returns null instead of undefined sometimes, but our actions return types are loose.
  // We can assert or default.
  const fam = data.fam!
  const members = data.members || []
  const posts = data.posts || []
  const isOwner = data.isOwner

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow border-l-4" style={{ borderColor: 'var(--fam-primary)' }}>
        <h1 className="text-3xl font-bold">{fam.name}</h1>
        {fam.vibe && <p className="text-gray-500 italic mt-1">"{fam.vibe}"</p>}

        <div className="mt-4 flex gap-4 text-sm text-gray-600">
           <span>{isOwner ? 'You are the Owner' : 'You are a Member'}</span>
           <span>•</span>
           <span>{members.length} {members.length === 1 ? 'member' : 'members'} visible</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
             <h2 className="text-lg font-semibold mb-4">Fam Feed</h2>
             {posts.length === 0 ? (
               <div className="text-center py-8 text-gray-500">
                 No posts yet. {isOwner && "Start the conversation!"}
               </div>
             ) : (
               <div className="space-y-4">
                 {posts.map((post: any) => (
                   <div key={post.id} className="border-b pb-4 last:border-0 last:pb-0">
                     <div className="flex justify-between items-start">
                       <div className="font-bold text-gray-800">{post.author.name}</div>
                       <div className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</div>
                     </div>
                     <p className="mt-2 text-gray-700">{post.content}</p>

                     {/* Comments would go here */}
                     {post.comments && post.comments.length > 0 && (
                       <div className="mt-3 ml-4 space-y-2 border-l-2 pl-3">
                         {post.comments.map((comment: any) => (
                           <div key={comment.id} className="text-sm">
                             <span className="font-semibold text-gray-600">{comment.author.name}: </span>
                             <span className="text-gray-600">{comment.content}</span>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>

        {/* Sidebar: Members & Invite */}
        <div className="space-y-6">
          {isOwner && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold mb-3">Invite Members</h3>
              <form action={async (formData) => {
                'use server'
                await inviteUser(famId, formData.get("username") as string)
              }}>
                <div className="flex gap-2">
                  <input
                    name="username"
                    placeholder="Username"
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    required
                  />
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">Add</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-3">Members ({members.length})</h3>
            <ul className="space-y-2">
              {members.map((member: any) => (
                <li key={member.id} className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                     {member.user?.name?.[0]?.toUpperCase()}
                   </div>
                   <span className="text-sm text-gray-700">
                     {member.user?.name}
                     {member.user_id === fam.owner_id && <span className="text-xs text-indigo-500 ml-1">(Owner)</span>}
                   </span>
                </li>
              ))}
            </ul>
            {!isOwner && (
              <p className="text-xs text-gray-400 mt-4 italic">
                Only the owner and you are visible here due to privacy settings.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
