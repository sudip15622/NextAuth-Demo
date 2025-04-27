import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
// import Resend from "next-auth/providers/resend"
import type { NextAuthConfig } from "next-auth"
import { prisma } from '@/lib/prisma';
import bcrypt from "bcryptjs";

// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [
        Google,
        GitHub,
        // Resend,
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials) {

                const email = credentials.email as string;
                const password = credentials.password as string;

                if (!email || !password) {
                    return null;
                }

                const user = await prisma.user.findFirst({
                    where: { email: email }
                })

                if (!user) {
                    return null;
                }
                if (!user.password) {
                    return null;
                }

                const isPasswordMatch = await bcrypt.compare(password, user.password);

                if (!isPasswordMatch) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Only runs for OAuth providers (not credentials)
            if (account?.provider !== "credentials") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                    include: { accounts: true },
                });

                // If email exists with another provider, force error to /signup
                if (existingUser && !existingUser.accounts.some(a => a.provider === account?.provider)) {
                    return `/signup?error=OAuthAccountNotLinked`;
                }
            }
            return true; // Allow sign-in
        },
        authorized({ request: { nextUrl }, auth }) {
            const isLoggedIn = !!auth?.user;
            const isAuthPage = nextUrl.pathname.startsWith("/login") ||
                nextUrl.pathname.startsWith("/signup");

            if (isAuthPage) {
                if (isLoggedIn) {
                    // Redirect to callbackUrl or home if logged in
                    const callbackUrl = new URLSearchParams(nextUrl.search).get("callbackUrl");
                    return Response.redirect(new URL(callbackUrl || "/", nextUrl));
                }
                return true;
            }

            if (!isLoggedIn) {
                let callbackUrl = nextUrl.pathname;
                if (nextUrl.search) {
                    callbackUrl += nextUrl.search;
                }
                const redirectUrl = new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl.origin);
                return Response.redirect(redirectUrl);
            }

            return true;
        },
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
            }

            if (trigger === "update" && session) {
                token = { ...token, ...session }
            }
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id;
            return session;
        }
    },
    pages: {
        signIn: "/login",
    }
} satisfies NextAuthConfig