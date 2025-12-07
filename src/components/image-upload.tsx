"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [mode, setMode] = useState<"upload" | "url">("upload");
    const [urlInput, setUrlInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                onChange(data.url);
            } else {
                setError(data.error || "เกิดข้อผิดพลาด");
            }
        } catch {
            setError("เกิดข้อผิดพลาดในการอัปโหลด");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            onChange(urlInput.trim());
            setUrlInput("");
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Mode Toggle */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant={mode === "upload" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode("upload")}
                    className={mode === "upload" ? "bg-gold hover:bg-gold-700" : ""}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    อัปโหลด
                </Button>
                <Button
                    type="button"
                    variant={mode === "url" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode("url")}
                    className={mode === "url" ? "bg-gold hover:bg-gold-700" : ""}
                >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    ใส่ URL
                </Button>
            </div>

            {/* Preview */}
            {value && (
                <div className="relative inline-block">
                    <div className="relative h-40 w-40 overflow-hidden rounded-lg border">
                        <Image
                            src={value}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized={value.startsWith("http")}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Upload Mode */}
            {mode === "upload" && !value && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
                        isUploading
                            ? "border-gold bg-gold/5"
                            : "border-charcoal-200 hover:border-gold hover:bg-charcoal-50"
                    )}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="mb-2 h-8 w-8 animate-spin text-gold" />
                            <p className="text-sm text-charcoal-500">กำลังอัปโหลด...</p>
                        </>
                    ) : (
                        <>
                            <ImageIcon className="mb-2 h-8 w-8 text-charcoal-400" />
                            <p className="text-sm font-medium text-charcoal">
                                คลิกเพื่อเลือกรูปภาพ
                            </p>
                            <p className="text-xs text-charcoal-500">
                                JPG, PNG, WebP, GIF (สูงสุด 5MB)
                            </p>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                    />
                </div>
            )}

            {/* URL Mode */}
            {mode === "url" && !value && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 rounded-lg border border-charcoal-200 px-4 py-2 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                    <Button
                        type="button"
                        onClick={handleUrlSubmit}
                        disabled={!urlInput.trim()}
                        className="bg-gold hover:bg-gold-700"
                    >
                        เพิ่ม
                    </Button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
