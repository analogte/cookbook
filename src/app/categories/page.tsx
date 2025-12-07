import { Metadata } from "next";
import { CategoryCard } from "@/components/category-card";
import { api } from "@/lib/trpc-server";

export const metadata: Metadata = {
  title: "หมวดหมู่อาหาร",
  description: "สำรวจหมวดหมู่อาหารหลากหลายประเภท ตั้งแต่อาหารไทยไปจนถึงขนมหวานและเครื่องดื่ม",
};

export default async function CategoriesPage() {
  const categories = await api.categories.list();

  return (
    <div className="py-section-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-gold">
            Explore
          </p>
          <h1 className="mt-2 font-display text-display-lg font-bold text-charcoal">
            หมวดหมู่อาหาร
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal-500">
            เลือกหมวดหมู่ที่คุณสนใจเพื่อค้นพบสูตรอาหารที่หลากหลาย
          </p>
          <div className="divider-elegant mx-auto mt-6 max-w-xs">
            <span className="text-gold">✦</span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {categories.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-charcoal-500">ยังไม่มีหมวดหมู่อาหาร</p>
          </div>
        )}
      </div>
    </div>
  );
}
