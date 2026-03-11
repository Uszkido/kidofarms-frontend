import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function proxy(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Admin Route Protection
        if (path.startsWith("/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Role-based Dashboard Protection
        if (path.startsWith("/dashboard/vendor") && token?.role !== "vendor" && token?.role !== "farmer") {
            return NextResponse.redirect(new URL("/dashboard/consumer", req.url));
        }

        if (path.startsWith("/dashboard/subscriber") && token?.role !== "subscriber") {
            return NextResponse.redirect(new URL("/subscriptions", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/admin/:path*",
        "/dashboard/:path*",
    ],
};
