export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'processing'

export interface RevenueData {
    day: string
    revenue: number
}

export interface Dish {
    id: number;
    name: string;
    price: number;
    description: string;
    image_url?: string;
    menu_type_id: number;
}
export interface DishType {
    id: number;
    menu_type_name: string;
}
export interface Order {
    id: number
    items: number
    total: string
    status: OrderStatus
    tableNumber?: number
    table_id: number;
    order_time?: string
    out_time?: string;
}
export interface OrderItem {
    id: string;
    order_id: number;
    menu_item_id: number;
    quantity: number;
    price: number;
}

export interface DashboardData {
    totalTables?: number;
    totalDishes?: number;
    totalUsers?: number;
    revenue?: string;
    revenueChart?: any[];
    popularDishes?: any[];
}
export type CloudinaryUploadResponse = {
    public_id: string;
    secure_url: string;
    // Add other fields you expect from Cloudinary
};