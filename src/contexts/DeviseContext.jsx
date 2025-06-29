import React, { createContext, useContext, useState } from "react";

const DeviseContext = createContext();

export function DeviseProvider({ children }) {
  const [devise, setDevise] = useState("EUR");

  return (
    <DeviseContext.Provider value={{ devise, setDevise }}>
      {children}
    </DeviseContext.Provider>
  );
}

export function useDevise() {
  return useContext(DeviseContext);
}
