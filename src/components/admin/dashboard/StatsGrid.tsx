import { Table, Utensils, Users, DollarSign } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    color: string
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
    <div className={`p-6 rounded-lg shadow flex items-center ${color}`}>
        <div className="p-3 rounded-full bg-white bg-opacity-30 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
)

export function StatsGrid({
    totalTables,
    totalDishes,
    totalUsers,
    revenue
}: {
    totalTables: number
    totalDishes: number
    totalUsers: number
    revenue: string
}) {
    const stats = [
        {
            title: "Tổng bàn",
            value: totalTables,
            icon: <Table className="h-5 w-5 text-cyan-600" />,
            color: "bg-cyan-100 text-cyan-800"
        },
        {
            title: "Món ăn",
            value: totalDishes,
            icon: <Utensils className="h-5 w-5 text-blue-600" />,
            color: "bg-blue-100 text-blue-800"
        },
        {
            title: "Người dùng",
            value: totalUsers,
            icon: <Users className="h-5 w-5 text-purple-600" />,
            color: "bg-purple-100 text-purple-800"
        },
        {
            title: "Doanh thu",
            value: revenue,
            icon: <DollarSign className="h-5 w-5 text-green-600" />,
            color: "bg-green-100 text-green-800"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                />
            ))}
        </div>
    )
}