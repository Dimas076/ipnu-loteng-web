"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SiteContextType {
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
}

const DEFAULT_LOGO = null;

const SiteContext = createContext<SiteContextType>({
  logoUrl: DEFAULT_LOGO,
  setLogoUrl: () => {},
});

export const SiteProvider = ({ children }: { children: React.ReactNode }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(DEFAULT_LOGO);

  useEffect(() => {
    // Muat logo dari local storage saat aplikasi berjalan
    const savedLogo = localStorage.getItem("site_logo");
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  const handleSetLogo = (url: string | null) => {
    setLogoUrl(url);
    if (url) {
      localStorage.setItem("site_logo", url);
    } else {
      localStorage.removeItem("site_logo");
    }
  };

  return (
    <SiteContext.Provider value={{ logoUrl, setLogoUrl: handleSetLogo }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
