// app/api/auth/[...nextauth]/route.ts
import { decodeJwt } from '@/utils/jwt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: credentials?.username,
                            password: credentials?.password
                        })
                    });

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.message || 'Login failed');
                    }

                    const { access_token } = await res.json();

                    if (!access_token) {
                        throw new Error('Access token not found in response');
                    }

                    const decoded = decodeJwt(access_token);
                    if (!decoded) {
                        throw new Error('Invalid token format');
                    }

                    return {
                        id: decoded.user_id?.toString() || '',
                        name: decoded.username || credentials?.username || '',
                        role: decoded.role || 'user',
                        accessToken: access_token
                    };
                } catch (error: any) {
                    console.error('Authentication error:', {
                        message: error.message,
                        stack: error.stack
                    });
                    throw error;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            async profile(profile) {
                try {
                    const res = await fetch(`${process.env.FLASK_API_URL}/login/google`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            google_id: profile.sub,
                            email: profile.email,
                            name: profile.name,
                            image: profile.picture
                        })
                    });

                    const { access_token, role } = await res.json();

                    return {
                        id: profile.sub,
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                        role: role || 'user',
                        accessToken: access_token
                    };
                } catch (error: any) {
                    console.error('Google auth error:', error);
                    throw new Error('Google authentication failed');
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 72 * 60 * 60 // 72 hours
    },
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.role = user.role;
                token.sub = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user.role = token.role;
            session.user.id = token.sub;
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Redirect logic có thể thêm vào đây
            return url.startsWith(baseUrl) ? url : baseUrl;
        }
    },
    pages: {
        signIn: '/login',
        error: '/auth/error'
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development'
});

export { handler as GET, handler as POST };