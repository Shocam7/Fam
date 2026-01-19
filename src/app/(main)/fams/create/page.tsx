
import { createFam } from "@/actions/fam"

export default function CreateFamPage() {
  async function handleSubmit(formData: FormData) {
    'use server'
    await createFam(formData)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a New Fam</h1>
      <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fam Name</label>
          <input
            name="name"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g. The 40 Chor"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">The Vibe</label>
          <textarea
            name="vibe"
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g. Cozy office nights, chaotic energy, pure wholesome fun..."
          />
          <p className="mt-2 text-sm text-gray-500">
            We'll use AI to generate a color scheme based on this vibe.
          </p>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Fam
        </button>
      </form>
    </div>
  )
}
