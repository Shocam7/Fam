'use client'

import { useState } from 'react'
import { createPost } from '@/actions/post'
import { Check } from 'lucide-react'

type Fam = {
  id: string
  name: string
}

export function CreatePost({ fams }: { fams: Fam[] }) {
  const [content, setContent] = useState('')
  const [selectedFams, setSelectedFams] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleFam = (id: string) => {
    if (selectedFams.includes(id)) {
      setSelectedFams(selectedFams.filter(f => f !== id))
    } else {
      setSelectedFams([...selectedFams, id])
    }
  }

  const toggleAll = () => {
    if (selectedFams.length === fams.length) {
      setSelectedFams([])
    } else {
      setSelectedFams(fams.map(f => f.id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content || selectedFams.length === 0) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('content', content)
    formData.append('famIds', JSON.stringify(selectedFams))

    await createPost(formData)

    setContent('')
    setSelectedFams([])
    setIsSubmitting(false)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="font-semibold mb-3">Post Update</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border rounded-lg p-3 min-h-[100px] mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Share with:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleAll}
              className={`px-3 py-1 text-sm rounded-full border transition ${
                selectedFams.length === fams.length && fams.length > 0
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              All Fams
            </button>
            {fams.map(fam => (
              <button
                key={fam.id}
                type="button"
                onClick={() => toggleFam(fam.id)}
                className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full border transition ${
                  selectedFams.includes(fam.id)
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {selectedFams.includes(fam.id) && <Check className="w-3 h-3" />}
                {fam.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content || selectedFams.length === 0}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
