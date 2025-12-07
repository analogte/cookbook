"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  ChefHat,
  Tags,
  FileText,
  ArrowLeft,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Recipes", href: "/admin/recipes", icon: ChefHat },
  { name: "Tags", href: "/admin/tags", icon: Tags },
  { name: "Articles", href: "/admin/articles", icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication on mount
  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    // Check if cookie exists (client-side check)
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check", { method: "GET" });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show nothing while checking auth (prevents flash of content)
  if (isAuthenticated === null && pathname !== "/admin/login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal-50">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  // For login page, render without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-charcoal">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-charcoal-700">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-cream">
              Gastro<span className="text-gold">nomique</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gold/10 text-gold"
                    : "text-charcoal-300 hover:bg-charcoal-700 hover:text-cream"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="border-t border-charcoal-700 p-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-charcoal-300 transition-colors hover:bg-charcoal-700 hover:text-cream"
          >
            <ArrowLeft className="h-5 w-5" />
            กลับไปหน้าเว็บไซต์
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-charcoal-200 bg-white px-6">
          <h1 className="font-display text-xl font-semibold text-charcoal">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-charcoal-500">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
