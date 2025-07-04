import React, { createContext, useContext } from 'react';
import RootStore from './RootStore';

const StoreContext = createContext<typeof RootStore | undefined>(undefined);

export const MobxStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoreContext.Provider value={RootStore}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a MobxStoreProvider');
  }
  return context;
};
