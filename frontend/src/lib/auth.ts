import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const authOptions: NextAuthOptions = {
    providers: [
        // Email + Password Login → delegates to Express backend
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const res = await fetch(`${API_URL}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!res.ok) {
                        const { error } = await res.json().catch(() => ({ error: "Login failed" }));
                        throw new Error(error || "Invalid credentials.");
                    }

                    const { token, user } = await res.json();

                    return {
                        id: String(user.id),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        accessToken: token,
                    };
                } catch (err: any) {
                    throw new Error(err.message || "Authentication failed.");
                }
            },
        }),

        // Google OAuth (optional)
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                }),
            ]
            : []),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).accessToken = token.accessToken;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    const res = await fetch(`${API_URL}/api/auth/social-login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                        }),
                    });

                    if (res.ok) {
                        const data = await res.json();
                        (user as any).id = data.user.id;
                        (user as any).role = data.user.role;
                        (user as any).accessToken = data.token;
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Social Login Sync Error:", error);
                    return false;
                }
            }
            return true;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    secret: process.env.NEXT_AUTH_SECRET || process.env.NEXTAUTH_SECRET,
};
