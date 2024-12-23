"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type ToonData = {
  name: string;
  level: number;
};

type ToonContextType = {
  toonData: ToonData | null;
  setToonData: React.Dispatch<React.SetStateAction<ToonData | null>>;
};

const ToonContext = createContext<ToonContextType | undefined>(undefined);

export const ToonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toonData, setToonData] = useState<ToonData | null>(null);

  return (
    <ToonContext.Provider value={{ toonData, setToonData }}>
      {children}
    </ToonContext.Provider>
  );
};

export const useToonContext = () => {
  const context = useContext(ToonContext);
  if (!context) {
    throw new Error("useToonContext must be used within a ToonProvider");
  }
  return context;
};
