import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "ไม่พบไฟล์รูปภาพ" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "รองรับเฉพาะไฟล์ JPG, PNG, WebP, GIF" },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "ไฟล์ต้องมีขนาดไม่เกิน 5MB" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split(".").pop() || "jpg";
        const filename = `${timestamp}-${randomString}.${extension}`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return the public URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({
            success: true,
            url,
            filename,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการอัปโหลด" },
            { status: 500 }
        );
    }
}
