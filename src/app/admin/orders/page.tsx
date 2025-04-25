'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { get } from '@/utils/api'
import { Order, OrderItem } from '@/types'
import { formatTime } from '@/lib/dateTimeConvert'

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [items, setItems] = useState<OrderItem[]>([])
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
    const [loading, setLoading] = useState({
        orders: true,
        items: false
    })
    const [error, setError] = useState({
        orders: '',
        items: ''
    })

    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        if (selectedOrderId !== null) {
            fetchOrderItems(selectedOrderId)
        }
    }, [selectedOrderId])

    const fetchOrders = async () => {
        try {
            setLoading(prev => ({ ...prev, orders: true }))
            setError(prev => ({ ...prev, orders: '' }))
            const res = await get('/api/orders')
            setOrders(res.data as Order[])
        } catch (err) {
            setError(prev => ({ ...prev, orders: 'Failed to load orders' }))
            console.error(err)
        } finally {
            setLoading(prev => ({ ...prev, orders: false }))
        }
    }

    const fetchOrderItems = async (orderId: number) => {
        try {
            setLoading(prev => ({ ...prev, items: true }))
            setError(prev => ({ ...prev, items: '' }))
            const res = await get('/api/order_items')
            const filtered = (res.data as OrderItem[]).filter(item => item.order_id === orderId)
            setItems(filtered)
        } catch (err) {
            setError(prev => ({ ...prev, items: 'Failed to load order items' }))
            console.error(err)
        } finally {
            setLoading(prev => ({ ...prev, items: false }))
        }
    }

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            processing: 'bg-blue-100 text-blue-800'
        }
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error.orders && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error.orders}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Order List</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {loading.orders ? (
                            <div className="p-6 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                No orders found
                            </div>
                        ) : (
                            orders.map(order => (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedOrderId(order.id)}
                                    className={`p-4 cursor-pointer transition-colors ${selectedOrderId === order.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">
                                                Table #{order.table_id}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {formatTime(order.order_time)} - {formatTime(order.out_time)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.total || 0))}
                                            </p>
                                            <div className="mt-1">
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
                    </div>
                    <div className="p-4">
                        {selectedOrderId === null ? (
                            <div className="text-center py-12 text-gray-500">
                                Select an order to view details
                            </div>
                        ) : loading.items ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : error.items ? (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error.items}</p>
                                    </div>
                                </div>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No items found for this order
                            </div>
                        ) : (
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Items</h3>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {items.map(item => (
                                        <li key={item.id} className="py-4">
                                            <div className="flex justify-between">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {item.menu_item_id}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.price || 0))}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Total: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.price || 0) * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <p>Subtotal</p>
                                        <p>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}