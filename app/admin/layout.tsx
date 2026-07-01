import Link from "next/link";
import { Copy, PlusCircle, Settings, LayoutList, RefreshCw } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <nav className="w-64 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
        <div className="p-6">
          <Link href="/admin">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Lahbabi Admin
            </h1>
          </Link>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-1 px-3">
          <Link href="/admin/ads" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium text-sm">
            <LayoutList className="w-4 h-4" />
            AdSense Manager
          </Link>
          <Link href="/admin/autonomous" className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium text-sm">
            <RefreshCw className="w-4 h-4" />
            Autonomous Engine
          </Link>
          <Link href="/admin/tools" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium text-sm">
            <PlusCircle className="w-4 h-4" />
            Tools CMS
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium text-sm">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium text-sm">
            Public Website
          </Link>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
