import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSidebar } from './SidebarContext';
import { Sidebar } from './Sidebar';
import { SidebarOverlay } from './SidebarOverlay';

interface SidebarContainerProps {
  children: ReactNode;
  onNavigate?: (screen: string) => void;
}

export const SidebarContainer: React.FC<SidebarContainerProps> = ({ 
  children, 
  onNavigate 
}) => {
  const { isOpen } = useSidebar();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      {/* Main app content */}
      <View style={styles.content}>
        {children}
      </View>
      
      {/* Sidebar and overlay - only render when open */}
      {isOpen && (
        <>
          <SidebarOverlay />
          <Sidebar onNavigate={onNavigate} />
        </>
      )}
    </View>
  );
};

