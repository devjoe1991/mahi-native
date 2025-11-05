import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  isAnimating: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setAnimating: (animating: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openSidebar = useCallback(() => {
    if (!isOpen && !isAnimating) {
      setIsAnimating(true);
      setIsOpen(true);
      
      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [isOpen, isAnimating]);

  const closeSidebar = useCallback(() => {
    if (isOpen && !isAnimating) {
      setIsAnimating(true);
      setIsOpen(false);
      
      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [isOpen, isAnimating]);

  const toggleSidebar = useCallback(() => {
    if (isAnimating) return; // Prevent rapid toggling during animation
    
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }, [isOpen, isAnimating, openSidebar, closeSidebar]);

  const setAnimating = useCallback((animating: boolean) => {
    setIsAnimating(animating);
  }, []);

  const value: SidebarContextType = {
    isOpen,
    isAnimating,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    setAnimating,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

