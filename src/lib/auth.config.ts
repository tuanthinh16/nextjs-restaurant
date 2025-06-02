import 'server-only';
import { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { decodeJwt } from '@/utils/jwt';



export default {
    session: {
        strategy: 'jwt',
        maxAge: 2592000,
        updateAge: 86400,
    },
    secret: process.env.AUTH_SECRET,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            async profile(profile) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/google`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        google_id: profile.sub,
                        email: profile.email,
                        name: profile.name,
                        image: profile.picture
                    })
                });
                if (!res.ok) throw new Error("Google authentication failed");
                const { access_token, role } = await res.json();
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: role || "user",
                    accessToken: access_token
                };
            }
        }),


        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing credentials");
                }
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password
                    })
                });
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || "Login failed");
                }
                const { access_token } = await res.json();
                if (!access_token) throw new Error("Access token not found in response");
                const decoded = decodeJwt(access_token);
                if (!decoded || !decoded.user_id) return null;
                return {
                    id: decoded.user_id.toString(),
                    name: String(decoded.username || credentials.username || ""),
                    role: decoded.role || "user",
                    accessToken: access_token
                };
            }
        }),
    ],
    debug: false,
    trustHost: true,
} satisfies NextAuthConfig;