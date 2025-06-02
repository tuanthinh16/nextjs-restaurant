'use client'
import { useState } from 'react'
import { LayoutDashboard, Menu, Table, Users, Utensils, X, ListOrdered } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { business_name } from '@/config/config'
import Link from 'next/link'
import { post } from '@/utils/api'

export function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const navItems = [
        { href: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { href: '/admin/tables', icon: <Table size={18} />, label: 'Quản lý bàn' },
        { href: '/admin/menu', icon: <Utensils size={18} />, label: 'Quản lý món ăn' },
        { href: '/admin/users', icon: <Users size={18} />, label: 'Quản lý user' },
        { href: '/admin/orders', icon: <ListOrdered size={18} />, label: 'Quản lý bàn ăn' }
    ]

    return (
        <>
            {/* Nút toggle sidebar (chỉ hiện trên mobile) */}
            <button
                className="md:hidden w-1/12 fixed top-3 mt-0.5 left-4 z-50 bg-cyan-700 text-white p-2 rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed z-40 top-0 left-0 bg-cyan-700 h-screen text-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 md:static md:w-2/12 w-64`}
            >
                <div className="p-4 border-b border-cyan-600">
                    <h1 className="text-xl font-bold hidden md:block">{business_name}</h1>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center p-3 rounded-lg transition-colors ${pathname === item.href ? 'bg-cyan-600' : 'hover:bg-cyan-800'
                                }`}
                            onClick={() => setIsOpen(false)} // tự đóng khi chọn
                        >
                            <span className="mr-3">{item.icon}</span>
                            <span className=" inline">{item.label}</span>
                        </Link>
                    ))}
                    <button
                        onClick={async () => {

                            const res = await post('/api/admin/reset-cache', null)
                            if (res.success)
                                alert(res.message || 'Successfully')
                            else
                                console.log("Error when reset cache: ", res.data)

                        }}
                        className="w-full mt-6 text-left flex items-center p-3 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                        🧹 <span className="ml-2">Xoá cache</span>
                    </button>

                </nav>
            </div>
        </>
    )
}
