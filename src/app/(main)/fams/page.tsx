import { getFams } from "@/actions/fam"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function FamsPage() {
  const { created, joined } = await getFams()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Fams</h1>
        <Link
          href="/fams/create"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          Create Fam
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Created by Me</h2>
        {created.length === 0 ? (
          <p className="text-gray-500 italic">You haven't created any Fams yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {created.map((fam: any) => (
              <Link key={fam.id} href={`/fams/${fam.id}`}>
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border-l-4 border-indigo-500">
                  <h3 className="text-lg font-bold">{fam.name}</h3>
                  {fam.vibe && <p className="text-sm text-gray-500 mt-1 italic">"{fam.vibe}"</p>}
                  <p className="text-xs text-gray-400 mt-4">{fam._count.members} members</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Fams I'm In</h2>
        {joined.length === 0 ? (
          <p className="text-gray-500 italic">You haven't joined any Fams yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {joined.map((fam: any) => (
              <Link key={fam.id} href={`/fams/${fam.id}`}>
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border-l-4 border-gray-300">
                  <h3 className="text-lg font-bold">{fam.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Owner: {fam.owner.name}</p>
                  {fam.vibe && <p className="text-sm text-gray-500 mt-1 italic">"{fam.vibe}"</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
