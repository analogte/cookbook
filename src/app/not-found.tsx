import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-section-md">
      <div className="text-center">
        <p className="text-9xl font-display font-bold text-gold/30">404</p>
        <h1 className="mt-4 font-display text-display-md font-bold text-charcoal">
          ไม่พบหน้าที่คุณต้องการ
        </h1>
        <p className="mt-2 text-charcoal-500">
          หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือไม่มีอยู่
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/">
            <Button variant="gold">กลับหน้าแรก</Button>
          </Link>
          <Link href="/recipes">
            <Button variant="outline">ดูสูตรอาหาร</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
