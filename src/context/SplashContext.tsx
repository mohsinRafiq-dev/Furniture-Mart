import React, { createContext, useContext, useState, useCallback } from "react";

interface SplashContextType {
  showSplash: boolean;
  splashComplete: boolean;
  completeSplash: () => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [splashComplete, setSplashComplete] = useState(false);

  const completeSplash = useCallback(() => {
    setShowSplash(false);
    setSplashComplete(true);
  }, []);

  return (
    <SplashContext.Provider
      value={{ showSplash, splashComplete, completeSplash }}
    >
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);
  if (!context) {
    throw new Error("useSplash must be used within SplashProvider");
  }
  return context;
}
