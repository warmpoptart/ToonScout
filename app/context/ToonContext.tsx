"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { ToonData } from "../types";

type ToonContextType = {
  toonData: ToonData | null;
  setToonData: React.Dispatch<React.SetStateAction<ToonData | null>>;
};

const ToonContext = createContext<ToonContextType | undefined>(undefined);

export const ToonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toonData, setToonData] = useState<ToonData | null>(null);

  const value = useMemo(() => ({ toonData, setToonData }), [toonData]);

  return <ToonContext.Provider value={value}>{children}</ToonContext.Provider>;
};

export const useToonContext = () => {
  const context = useContext(ToonContext);
  if (!context) {
    throw new Error("useToonContext must be used within a ToonProvider");
  }
  return context;
};
