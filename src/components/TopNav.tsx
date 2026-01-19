'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export function TopNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <span className="font-bold text-lg text-indigo-600">FAM</span>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <nav className="absolute top-14 left-0 w-full bg-white border-b shadow-lg flex flex-col p-4 space-y-4">
            <Link href="/feed" className="block py-2 font-medium" onClick={() => setIsOpen(false)}>My Feed</Link>
            <Link href="/discover" className="block py-2 font-medium" onClick={() => setIsOpen(false)}>Discover</Link>
            <Link href="/fams" className="block py-2 font-medium" onClick={() => setIsOpen(false)}>My Fams</Link>
            <Link href="/councils" className="block py-2 font-medium" onClick={() => setIsOpen(false)}>Councils</Link>
        </nav>
      )}
    </header>
  )
}
