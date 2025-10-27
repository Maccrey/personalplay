import { createContext, useContext } from 'react';

const AdContext = createContext();

export function AdProvider({ children }) {
  return (
    <AdContext.Provider value={{ isAdAllowed: true, setIsAdAllowed: () => {} }}>
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
