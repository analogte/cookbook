import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidToken } from "@/lib/auth";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("admin_session")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Verify JWT token
        const isValid = await isValidToken(token);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        return NextResponse.json({ authenticated: true });
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { error: "Auth check failed" },
            { status: 500 }
        );
    }
}
