import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface AgendaCardProps {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "finished";
}

export function AgendaCard({ slug, title, date, time, location, status }: AgendaCardProps) {
  const isUpcoming = status === "upcoming";
  
  return (
    <Card className={`overflow-hidden flex flex-col hover:border-primary/50 transition-colors ${!isUpcoming ? 'opacity-75 grayscale-[0.3]' : ''}`}>
      <Link href={`/agenda/${slug}`} className="flex-1 flex flex-col">
        <div className="flex">
          {/* Calendar Badge Area */}
          <div className="bg-primary/5 flex flex-col items-center justify-center p-4 border-r border-b w-24 flex-shrink-0 text-on-primary">
            <span className="text-sm font-semibold text-primary/70 uppercase">Agu</span>
            <span className="text-3xl font-bold text-primary">15</span>
          </div>
          <CardHeader className="flex-1 p-4 pb-2">
            <div className="flex justify-between items-start mb-1">
              <Badge variant={isUpcoming ? "default" : "secondary"}>
                {isUpcoming ? "Akan Datang" : "Selesai"}
              </Badge>
            </div>
            <CardTitle className="line-clamp-2 text-lg hover:text-primary transition-colors">
              {title}
            </CardTitle>
          </CardHeader>
        </div>
        <CardContent className="mt-auto pt-4 p-4 flex-none border-t bg-muted/10 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 shrink-0 text-primary/70" />
            <span>{time}</span>
          </div>
          <div className="flex items-start text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 shrink-0 text-primary/70 mt-0.5" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
