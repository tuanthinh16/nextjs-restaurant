// utils/jwt.ts
import jwt from 'jsonwebtoken';

interface JwtPayload {
    user_id?: string | number;
    username?: string;
    role?: string;
    exp?: number;
    [key: string]: any;
}

export const decodeJwt = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.decode(token);
        return decoded as JwtPayload;
    } catch (error) {
        console.error('JWT decode error:', error);
        return null;
    }
};

export const verifyJwt = (token: string, secret: string): JwtPayload | null => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
};