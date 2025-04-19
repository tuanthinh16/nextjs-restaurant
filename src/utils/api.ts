// utils/api.ts
import axios from 'axios';
import { getSession } from 'next-auth/react';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Hàm helper để lấy token từ session
const getAuthToken = async (): Promise<string | null> => {
    try {
        const session = await getSession();

        // Kiểm tra nhiều trường hợp token có thể được lưu
        const token =
            session?.accessToken ||        // Trường hợp thông thường
            session?.user?.accessToken  // Khi token được lưu trong user       

        if (!token) {
            console.warn('No token found in session:', session);
            return null;
        }

        return token;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
};

// Hàm kiểm tra nếu data có chứa file
const isFileData = (data: any): boolean => {
    if (data instanceof FormData) return true;
    if (data instanceof File) return true;
    if (data instanceof Blob) return true;
    if (Array.isArray(data)) return data.some(isFileData);
    if (typeof data === 'object' && data !== null) {
        return Object.values(data).some(isFileData);
    }
    return false;
};
// Interceptor để thêm token và xử lý multipart
api.interceptors.request.use(async (config) => {
    const token = await getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Xử lý multipart nếu có file
    if (config.data && isFileData(config.data)) {
        // Nếu data chưa phải FormData, chuyển đổi
        if (!(config.data instanceof FormData)) {
            const formData = new FormData();
            Object.entries(config.data).forEach(([key, value]) => {
                if (value instanceof File || value instanceof Blob) {
                    formData.append(key, value);
                } else if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item);
                    });
                } else {
                    formData.append(key, String(value));
                }
            });
            config.data = formData;
        }
        config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor để xử lý lỗi chung
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Xử lý khi token hết hạn hoặc không hợp lệ
            if (typeof window !== 'undefined') {
                window.location.href = '/login'; // Redirect đến trang login
            }
        }
        return Promise.reject(error);
    }
);

// Các hàm API với TypeScript generics
type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    message?: string;
};

export const get = async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
    try {
        const response = await api.get<T>(url, { params });
        return {
            success: true,
            data: response.data,
            ...response.data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.message
        };
    }
};

// Cập nhật các hàm HTTP với hỗ trợ file
export const post = async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
    try {
        const response = await api.post<T>(url, data);
        return {
            success: true,
            data: response.data,
            ...response.data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.message
        };
    }
};

export const put = async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
    try {
        const response = await api.put<T>(url, data);
        return {
            success: true,
            data: response.data,
            ...response.data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.message
        };
    }
};

export const deleteAPI = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    try {
        const response = await api.delete<T>(url, { data });
        return {
            success: true,
            data: response.data,
            ...response.data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.message
        };
    }
};

export default api;