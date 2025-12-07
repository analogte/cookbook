import Link from "next/link";
import { FolderOpen, ChefHat, Tags, FileText, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc-server";

export default async function AdminDashboardPage() {
  const [categories, recipes, tags, articles] = await Promise.all([
    api.categories.list(),
    api.recipes.list(),
    api.tags.list(),
    api.articles.list(),
  ]);

  const stats = [
    {
      name: "Categories",
      value: categories.length,
      icon: FolderOpen,
      href: "/admin/categories",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Recipes",
      value: recipes.length,
      icon: ChefHat,
      href: "/admin/recipes",
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      name: "Tags",
      value: tags.length,
      icon: Tags,
      href: "/admin/tags",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Articles",
      value: articles.length,
      icon: FileText,
      href: "/admin/articles",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  // Get top viewed recipes
  const topRecipes = [...recipes]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  // Get top viewed articles
  const topArticles = [...articles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={cn("rounded-lg p-3", stat.bgColor)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-charcoal-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Recipes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold" />
              สูตรยอดนิยม
            </CardTitle>
            <Link href="/admin/recipes">
              <Button variant="ghost" size="sm">
                ดูทั้งหมด
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {topRecipes.length > 0 ? (
              <div className="space-y-4">
                {topRecipes.map((recipe, index) => (
                  <div
                    key={recipe.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-100 text-sm font-medium text-charcoal">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-charcoal">
                          {recipe.name}
                        </p>
                        <p className="text-sm text-charcoal-500">
                          {recipe.difficulty === "easy"
                            ? "ง่าย"
                            : recipe.difficulty === "medium"
                            ? "ปานกลาง"
                            : "ยาก"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-charcoal-500">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">
                        {recipe.viewCount?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-charcoal-500">ยังไม่มีข้อมูล</p>
            )}
          </CardContent>
        </Card>

        {/* Top Articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              บทความยอดนิยม
            </CardTitle>
            <Link href="/admin/articles">
              <Button variant="ghost" size="sm">
                ดูทั้งหมด
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {topArticles.length > 0 ? (
              <div className="space-y-4">
                {topArticles.map((article, index) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-100 text-sm font-medium text-charcoal">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-charcoal">
                          {article.title}
                        </p>
                        <p className="text-sm text-charcoal-500">
                          {article.author || "ไม่ระบุผู้เขียน"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-charcoal-500">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">
                        {article.viewCount?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-charcoal-500">ยังไม่มีข้อมูล</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/categories">
              <Button variant="outline">
                <FolderOpen className="mr-2 h-4 w-4" />
                เพิ่มหมวดหมู่
              </Button>
            </Link>
            <Link href="/admin/recipes">
              <Button variant="outline">
                <ChefHat className="mr-2 h-4 w-4" />
                เพิ่มสูตรอาหาร
              </Button>
            </Link>
            <Link href="/admin/tags">
              <Button variant="outline">
                <Tags className="mr-2 h-4 w-4" />
                เพิ่มแท็ก
              </Button>
            </Link>
            <Link href="/admin/articles">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                เพิ่มบทความ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
