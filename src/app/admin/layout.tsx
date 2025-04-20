import { Sidebar } from '@/components/admin/Sidebar'
import { AdminNavbar } from '@/components/admin/Navbar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen ">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <AdminNavbar />
                <main className="flex-1 p-6 pt-20">
                    {children}
                </main>
            </div>
        </div>
    )
}