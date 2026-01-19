
import { getFeed } from "@/actions/post"
import { getFams } from "@/actions/fam"
import { CreatePost } from "@/components/CreatePost"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function FeedPage() {
  const { posts } = await getFeed()
  const { created, joined } = await getFams()

  const allFams = [...created, ...joined]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Feed</h1>

      {allFams.length > 0 ? (
        <CreatePost fams={allFams} />
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg text-blue-800 mb-6">
          <p>You haven't joined any Fams yet.</p>
          <Link href="/fams/create" className="underline font-bold">Create a Fam</Link> or wait for an invite!
        </div>
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
             <div className="flex justify-center mb-4">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                 <Plus className="w-8 h-8 text-gray-400" />
               </div>
             </div>
             <p className="text-gray-500 text-lg">Create or join a fam to see updates.</p>
          </div>
        ) : (
          posts.map((post: any) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700">
                     {post.author.name?.[0]?.toUpperCase()}
                   </div>
                   <div>
                     <div className="font-bold text-gray-900">{post.author.name}</div>
                     <div className="text-xs text-gray-500">
                       {new Date(post.created_at).toLocaleDateString()}
                       <span className="mx-1">•</span>
                       <span className="italic">
                         Shared to {post.post_fams?.length || 0} fams
                       </span>
                     </div>
                   </div>
                </div>
              </div>

              <p className="text-gray-800 text-lg whitespace-pre-wrap">{post.content}</p>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t flex gap-4">
                <button className="text-sm text-gray-500 hover:text-indigo-600 font-medium">Like</button>
                <button className="text-sm text-gray-500 hover:text-indigo-600 font-medium">Comment</button>
                <button className="text-sm text-gray-500 hover:text-indigo-600 font-medium">Discuss in Council</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
