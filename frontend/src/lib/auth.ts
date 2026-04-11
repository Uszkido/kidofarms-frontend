import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'kido-farms-super-secret-12345';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                token: { label: "Token", type: "text" },
                impersonation: { label: "Impersonation", type: "text" }
            },
            async authorize(credentials) {
                // --- GHOST PROTOCOL (IMPERSONATION) BYPASS ---
                if (credentials?.impersonation === "true" && credentials?.token) {
                    try {
                        const decoded: any = jwt.verify(credentials.token, JWT_SECRET);
                        return {
                            id: decoded.id,
                            name: decoded.name,
                            email: decoded.email,
                            role: decoded.role,
                            permissions: decoded.permissions || [],
                            accessToken: credentials.token,
                        };
                    } catch (err) {
                        console.error("Ghost Auth Failed:", err);
                        return null;
                    }
                }

                // --- STANDARD AUTHENTICATION ---
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
                        permissions: user.permissions || [],
                        accessToken: token,
                    };
                } catch (err: any) {
                    throw new Error(err.message || "Authentication failed.");
                }
            },
        }),

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
        maxAge: 30 * 24 * 60 * 60,
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.permissions = (user as any).permissions;
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).permissions = token.permissions;
                (session.user as any).accessToken = token.accessToken;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',
    },
};
