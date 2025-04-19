// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            name?: string;
            email?: string;
            image?: string;
            username?: string; // Thêm trường tùy chỉnh
            role?: string;    // Thêm trường tùy chỉnh
        } & DefaultSession["user"];
    }

    interface User {
        id?: string;
        accessToken?: string;
        role?: string;
        username?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        role?: string;
        username?: string;
    }
}