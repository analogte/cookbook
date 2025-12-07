import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Verify token validity
function verifyToken(token: string): boolean {
    try {
        const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
        // Check if token is expired
        if (payload.exp && payload.exp < Date.now()) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("admin_session")?.value;

        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { error: "Not authenticated" },
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
