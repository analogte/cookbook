import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";

// Admin credentials from environment
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Validate credentials
        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: "Username หรือ Password ไม่ถูกต้อง" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = await generateToken(username);

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set("admin_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
            { status: 500 }
        );
    }
}
