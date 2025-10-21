import { createContext, useContext, useState } from 'react';

const AdContext = createContext();

export function AdProvider({ children }) {
  const [isAdAllowed, setIsAdAllowed] = useState(false);

  return (
    <AdContext.Provider value={{ isAdAllowed, setIsAdAllowed }}>
      {children}
    </AdContext.Provider>
  );
}

export function useAdContext() {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAdContext must be used within an AdProvider');
  }
  return context;
}
