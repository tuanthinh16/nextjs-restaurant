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
}

export interface Order {
    id: string
    items: number
    amount: string
    status: OrderStatus
    tableNumber?: number
    timestamp?: string
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