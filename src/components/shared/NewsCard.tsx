import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface NewsCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export function NewsCard({ slug, title, excerpt, date, category }: NewsCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col hover:border-primary/50 transition-colors group">
      <Link href={`/berita/${slug}`} className="flex-1 flex flex-col">
        <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
          <ImageIcon className="h-10 w-10 text-muted-foreground/30 transition-transform" />
        </div>
        <CardHeader className="flex-none">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold bg-primary/10 px-2 py-1 rounded-full text-on-primary">
              {category}
            </span>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
          <CardTitle className="line-clamp-2 text-xl hover:text-primary hover:underline underline-offset-4 transition-all">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto flex-none">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {excerpt}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
