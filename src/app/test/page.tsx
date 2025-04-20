'use client'
// pages/index.tsx
import { useEffect } from 'react';
import io from 'socket.io-client';

const Home = () => {
    useEffect(() => {
        // Kết nối đến WebSocket server của bạn
        const socket = io('http://localhost:1314');

        // Gửi sự kiện test_db để kiểm tra kết nối
        socket.emit('get_menu_with_quantity');

        // Nhận phản hồi thành công
        socket.on('menu_with_quantity_response', (data: { items: Array<any> }) => {
            console.log('DB Success:', data);
        });

        // Nhận phản hồi lỗi nếu có
        socket.on('test_db_error', (error: { error: string }) => {
            console.error('DB Error:', error);
        });

        // Đảm bảo ngắt kết nối khi component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Test WebSocket Connection with Socket.IO</h1>
            <p>Check the console for logs from the server!</p>
        </div>
    );
};

export default Home;
