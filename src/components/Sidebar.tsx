import Link from 'next/link'
import { Home, Compass, Users, MessageCircle } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-600">FAM</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link href="/feed" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Home className="w-5 h-5" />
          <span className="font-medium">My Feed</span>
        </Link>

        <Link href="/discover" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Compass className="w-5 h-5" />
          <span className="font-medium">Discover People</span>
        </Link>

        <Link href="/fams" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Users className="w-5 h-5" />
          <span className="font-medium">My Fams</span>
        </Link>

        {/* Placeholder for Councils link if needed, but My Fams might cover it or separate it */}
        <Link href="/councils" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Councils</span>
        </Link>
      </nav>

      <div className="p-4 border-t">
         {/* Profile Link - Assuming we can get the user ID later, for now just a link */}
         {/* We'll make this dynamic with a client component wrapper or server component logic */}
      </div>
    </aside>
  )
}
