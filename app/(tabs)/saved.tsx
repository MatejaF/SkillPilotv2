import React, { createContext, useContext, useState } from 'react';

const SavedContext = createContext({
  savedItems: [] as any[],
  toggleSaved: (item: any) => {},
});

export const SavedProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedItems, setSavedItems] = useState<any[]>([]);

  const toggleSaved = (item: any) => {
    const exists = savedItems.find(i => i.id === item.id);
    if (exists) {
      setSavedItems(savedItems.filter(i => i.id !== item.id));
    } else {
      setSavedItems([...savedItems, item]);
    }
  };

  return (
    <SavedContext.Provider value={{ savedItems, toggleSaved }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
