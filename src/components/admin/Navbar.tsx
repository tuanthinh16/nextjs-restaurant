'use client'
import { Search, Bell, User } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function AdminNavbar() {
    const { data: session } = useSession();
    return (
        <header className="bg-white shadow-sm md:w-10/12 fixed z-1 w-full ">
            <div className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center pl-10">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                        <Bell className="h-6 w-6" />
                    </button>

                    <div className="relative">
                        <button className="flex items-center space-x-2 focus:outline-none">
                            <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-cyan-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{session?.user.name}</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}