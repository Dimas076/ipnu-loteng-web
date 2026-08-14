"use client";

import { Share2 } from "lucide-react";
import { Button } from "./button";

export function ShareButton({ title }: { title: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Gagal membagikan:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Tautan berhasil disalin ke papan klip!");
      } catch (err) {
        console.error("Gagal menyalin tautan:", err);
      }
    }
  };

  return (
    <Button variant="outline" size="sm" className="h-8 gap-2" onClick={handleShare}>
      <Share2 className="h-3 w-3" /> Bagikan
    </Button>
  );
}
