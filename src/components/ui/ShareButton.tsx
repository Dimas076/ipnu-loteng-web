"use client";

import { Share2, Check } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
        return;
      } catch (err) {
        console.error("Gagal membagikan:", err);
      }
    }
    
    // Fallback: Copy to clipboard if navigator.share fails or is not available
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={`h-8 gap-2 transition-all ${copied ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-600' : ''}`} 
      onClick={handleShare}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" /> Tersalin!
        </>
      ) : (
        <>
          <Share2 className="h-3 w-3" /> Bagikan
        </>
      )}
    </Button>
  );
}
