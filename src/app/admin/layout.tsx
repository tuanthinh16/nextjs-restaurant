import { Sidebar } from '@/components/admin/Sidebar'
import { AdminNavbar } from '@/components/admin/Navbar'
import { LanguageProvider } from '../languageContex'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <LanguageProvider>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <AdminNavbar />
                    <main className="flex-1 p-6 overflow-x-hidden pt-20">
                        {children}
                    </main>
                </div>
            </div>
        </LanguageProvider>
    )
}