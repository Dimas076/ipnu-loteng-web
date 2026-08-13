"use client";

import { useEffect } from "react";

export function PrintButton() {
  useEffect(() => {
    // Add print handler to any button with onClick="window.print()" logic
    // We do this via useEffect since the main page is a Server Component
    const printBtns = document.querySelectorAll('button');
    printBtns.forEach(btn => {
      if (btn.textContent?.includes('Cetak')) {
        btn.onclick = () => window.print();
      }
    });
  }, []);

  return null;
}
