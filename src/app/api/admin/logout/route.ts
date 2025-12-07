import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("admin_session");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาด" },
            { status: 500 }
        );
    }
}
