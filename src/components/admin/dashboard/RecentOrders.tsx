import { Clock, CheckCircle2, XCircle } from 'lucide-react'
export type OrderStatus = 'pending' | 'completed' | 'cancelled'

export interface Order {
    id: string
    items: number
    amount: string
    status: OrderStatus
}
// Helper function để validate status
function isValidStatus(status: string): status is OrderStatus {
    return ['pending', 'completed', 'cancelled'].includes(status)
}

// Transform data nếu cần
function transformOrder(order: any): Order {
    return {
        ...order,
        status: isValidStatus(order.status) ? order.status : 'pending' // Mặc định là pending nếu không hợp lệ
    }
}

export function RecentOrders({ orders }: { orders: Order[] }) {
    const transformedOrders = orders.map(transformOrder)

    const statusIcons = {
        pending: <Clock className="h-4 w-4 text-yellow-500" />,
        completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        cancelled: <XCircle className="h-4 w-4 text-red-500" />
    }

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số món</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transformedOrders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[order.status]} flex items-center gap-1`}>
                                        {statusIcons[order.status]}
                                        {order.status === 'pending' ? 'Đang chờ' :
                                            order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}