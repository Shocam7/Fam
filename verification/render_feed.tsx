import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Mock Components
function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-600">FAM</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">My Feed</a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Discover People</a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">My Fams</a>
      </nav>
    </aside>
  );
}

function FeedItem({ author, content }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700">
             {author[0]}
           </div>
           <div>
             <div className="font-bold text-gray-900">{author}</div>
             <div className="text-xs text-gray-500">Just now</div>
           </div>
        </div>
      </div>
      <p className="text-gray-800 text-lg">{content}</p>
    </div>
  );
}

function Page() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64 p-8">
        <h1 className="text-3xl font-bold mb-6 text-black">My Feed</h1>
        <FeedItem author="User A" content="This is a post from the owner of the Fam." />
        <FeedItem author="User B" content="This is a post from me, visible to me." />
        <div className="text-center py-8 text-gray-500 italic">User C post is hidden (Privacy Check)</div>
      </div>
    </div>
  );
}

const html = renderToStaticMarkup(
  <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <Page />
    </body>
  </html>
);

console.log(html);
