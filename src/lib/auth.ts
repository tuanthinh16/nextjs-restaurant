
import NextAuth, { User, type Session } from 'next-auth';

import authConfig from '@/lib/auth.config';
import { JWT } from 'next-auth/jwt';


/**
 * Auth.js (NextAuth.js) Main Configuration
 *
 * @description Primary authentication configuration that extends auth.config.ts.
 *
 * @notice This configuration:
 * Uses JWT strategy for session handling
 * Implements custom types, @/lib/auth/types.d.ts
 * Manages user role and session data through JWT tokens
 *
 */
export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    unstable_update,
} = NextAuth({
    pages: {
        signIn: '/login',
        error: '/loginerror',
    },
    events: {
        // Runs AFTER an account is linked/OAuth sign in
        async signIn({ user, account, isNewUser }) {
            if (isNewUser && account?.provider === 'resend' && !user.name) {
                // do stuff
            }
            if (isNewUser && account?.provider !== 'credentials') {
                // TODO: send welcome email?
            }
        },
    },

    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.accessToken = token.accessToken;
            }
            return session;
        },
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }
    },
    ...authConfig,
});