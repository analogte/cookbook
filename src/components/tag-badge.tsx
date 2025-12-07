import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: {
    id: number;
    name: string;
    slug: string;
    color?: string | null;
  };
  href?: boolean;
  className?: string;
}

export function TagBadge({ tag, href = true, className }: TagBadgeProps) {
  const badge = (
    <Badge
      variant="outline"
      className={cn(
        "transition-colors hover:bg-gold/10 hover:text-gold-800",
        className
      )}
      style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
    >
      {tag.name}
    </Badge>
  );

  if (href) {
    return <Link href={`/tags/${tag.slug}`}>{badge}</Link>;
  }

  return badge;
}
