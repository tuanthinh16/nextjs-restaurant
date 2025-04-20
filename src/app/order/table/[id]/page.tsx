'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getSocket } from '@/utils/socket';
import Waitting from '@/components/ui/Waitting';
import CardMenu from '@/components/ui/CardMenu';
import { DishType } from '@/types';
import { get } from '@/utils/api';
import { Plus, CheckCircle } from 'lucide-react';

const Page = () => {
    const { id } = useParams();
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [order, setOrder] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [menuTypes, setMenuTypes] = useState<DishType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    // Socket operations
    useEffect(() => {
        let socket: any;

        const initSocket = async () => {
            socket = await getSocket();
            socket.emit('join_table', id);
            socket.emit('get_menu_with_quantity');

            socket.on('menu_with_quantity_response', (res: any) => {
                if (res.success) {
                    setMenuItems(res.data);
                    setFilteredItems(res.data);
                    setError(null);
                } else {
                    setError('Không thể tải menu!');
                }
            });

            socket.on('order_update', (data: any) => {
                if (data.tableId === id) setOrder(data.order);
            });

            socket.on('order_submission_result', (result: any) => {
                setLoading(false);
                if (result.success) {
                    setSuccess('Đơn hàng đã được xác nhận thành công!');
                    setOrder({});
                    setError(null);
                    setTimeout(() => setSuccess(null), 3000);
                } else {
                    setError(result.error || 'Có lỗi xảy ra khi xác nhận đơn hàng.');
                    setSuccess(null);
                }
            });
        };

        initSocket();

        return () => {
            if (socket) {
                socket.off('order_update');
                socket.off('menu_with_quantity_response');
                socket.off('order_submission_result');
                socket.disconnect();
            }
        };
    }, [id]);

    // Fetch menu types
    useEffect(() => {
        const fetchDataToDishType = async () => {
            try {
                const rs = await get<DishType[]>('/api/menu-type');
                if (rs.success) {
                    setMenuTypes(rs.data as DishType[]);
                }
            } catch (err) {
                console.error('Error fetching menu types:', err);
            }
        };
        fetchDataToDishType();
    }, []);

    const addItem = useCallback(async (itemId: string) => {
        const socket = await getSocket();
        const updated = { ...order, [itemId]: (order[itemId] || 0) + 1 };
        setOrder(updated);
        socket.emit('order_update', { tableId: id, order: updated });
    }, [order, id]);
    const subItem = useCallback(async (itemId: string) => {
        const socket = await getSocket();
        const updated = { ...order, [itemId]: (order[itemId] || 0) - 1 };
        setOrder(updated);
        socket.emit('order_update', { tableId: id, order: updated });
    }, [order, id]);

    const confirmOrder = useCallback(async () => {
        if (Object.keys(order).length === 0) {
            setError('Vui lòng chọn ít nhất một món');
            return;
        }

        setLoading(true);
        setError(null);
        const socket = await getSocket();
        socket.emit('submit_order', {
            table_id: id,
            items: order
        });
    }, [order, id]);

    const filterItems = useCallback((categoryId: number | null) => {
        setSelectedCategory(categoryId);
        if (categoryId === null) {
            setFilteredItems(menuItems);
        } else {
            setFilteredItems(menuItems.filter(item => item.menu_type_id === categoryId));
        }
    }, [menuItems]);

    const totalItems = Object.values(order).reduce((sum, quantity) => sum + quantity, 0);

    return (
        <div className="p-4 max-w-7xl mx-auto pb-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Bàn {id}</h1>
                {totalItems > 0 && (
                    <div className="bg-primary text-white rounded-full px-3 py-1 flex items-center">
                        <span className="mr-1">{totalItems}</span>
                        <CheckCircle className="h-4 w-4" />
                    </div>
                )}
            </div>

            {loading && <Waitting />}

            {/* Status messages */}
            <div className="mb-4">
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg">
                        {success}
                    </div>
                )}
            </div>

            {/* Category filters */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => filterItems(null)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${selectedCategory === null
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                >
                    Tất cả
                </button>
                {menuTypes?.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => filterItems(type.id)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${selectedCategory === type.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                    >
                        {type.menu_type_name}
                    </button>
                ))}
            </div>

            {/* Menu items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {filteredItems.map(item => (
                    <CardMenu
                        key={item.id}
                        item={item}
                        order={order}
                        subItem={subItem}
                        addItem={addItem}
                    />
                ))}
            </div>

            {/* Order confirmation */}
            {Object.keys(order).length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="font-medium">
                            {totalItems} món đã chọn
                        </div>
                        <Button
                            onClick={confirmOrder}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center"
                            disabled={loading}
                        >
                            {loading ? 'Đang xác nhận...' : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Xác nhận đơn hàng
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;