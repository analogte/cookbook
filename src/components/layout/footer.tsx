import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-charcoal text-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-bold">
                Gastro<span className="text-gold">nomique</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-cream/70">
              สูตรอาหารพรีเมียมและเทคนิคการทำอาหารระดับเชฟ
              สำหรับผู้ที่หลงใหลในศิลปะการทำอาหาร
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              เมนูหลัก
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-cream/70 transition-colors hover:text-gold"
                >
                  หมวดหมู่อาหาร
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes"
                  className="text-sm text-cream/70 transition-colors hover:text-gold"
                >
                  สูตรอาหารทั้งหมด
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-sm text-cream/70 transition-colors hover:text-gold"
                >
                  บทความความรู้
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              หมวดหมู่ยอดนิยม
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/categories/thai-cuisine"
                  className="text-sm text-cream/70 transition-colors hover:text-gold"
                >
                  อาหารไทย
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/desserts"
                  className="text-sm text-cream/70 transition-colors hover:text-gold"
                >
                  ขนมหวาน
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/beverages"
                  className="text-sm text-cream/70 transition-colors hover:text-gold"
                >
                  เครื่องดื่ม
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-cream/10 pt-8">
          <p className="text-center text-xs text-cream/50">
            &copy; {new Date().getFullYear()} Gastronomique. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
