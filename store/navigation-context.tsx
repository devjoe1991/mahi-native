import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { HomeScreen } from '../screens/homeScreen';
import { UserProfileScreen } from '../screens/userProfileScreen';
import { EditProfileScreen } from '../screens/userProfileScreen';
import { NotificationsScreen } from '../screens/notificationsScreen';
import { MessagesScreen } from '../screens/messagesScreen';
import { NearbyScreen } from '../screens/nearbyScreen';
import { DiaryScreen } from '../screens/diaryScreen';
import { SidebarProvider, SidebarContainer } from '../components/globals/Sidebar';
import { GlobalBottomSheetProvider } from '../components/globals/globalBottomSheet';
import { GlobalModalProvider } from '../components/globals/globalModal';

type ScreenName = 'HomeScreen' | 'UserProfileScreen' | 'EditProfileScreen' | 'NotificationsScreen' | 'MessagesScreen' | 'NearbyScreen' | 'DiaryScreen';

interface NavigationContextType {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName, params?: any) => void;
  goBack: () => void;
  params: any;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children?: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('HomeScreen');
  const [params, setParams] = useState<any>({});
  const [screenHistory, setScreenHistory] = useState<ScreenName[]>(['HomeScreen']);

  const navigate = useCallback((screen: ScreenName | string, navigationParams?: any) => {
    const screenName = screen as ScreenName;
    if (['HomeScreen', 'UserProfileScreen', 'EditProfileScreen', 'NotificationsScreen', 'MessagesScreen', 'NearbyScreen', 'DiaryScreen'].includes(screenName)) {
      setScreenHistory((prev) => [...prev, currentScreen]);
      setCurrentScreen(screenName);
      setParams(navigationParams || {});
    }
  }, [currentScreen]);

  const goBack = useCallback(() => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory((prev) => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
      setParams({});
    }
  }, [screenHistory]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HomeScreen':
        return (
          <SidebarProvider>
            <SidebarContainer>
              <HomeScreen />
            </SidebarContainer>
          </SidebarProvider>
        );
      case 'UserProfileScreen':
        return (
          <SidebarProvider>
            <SidebarContainer>
              <UserProfileScreen
                viewMode={params.viewMode || false}
                userId={params.userId}
                onNavigate={navigate as any}
              />
            </SidebarContainer>
          </SidebarProvider>
        );
      case 'EditProfileScreen':
        return (
          <SidebarProvider>
            <SidebarContainer>
              <EditProfileScreen
                onNavigate={navigate as any}
                onSave={params.onSave}
              />
            </SidebarContainer>
          </SidebarProvider>
        );
      case 'NotificationsScreen':
        return (
          <SidebarProvider>
            <SidebarContainer>
              <NotificationsScreen />
            </SidebarContainer>
          </SidebarProvider>
        );
      case 'MessagesScreen':
        return (
          <SidebarProvider>
            <SidebarContainer>
              <MessagesScreen />
            </SidebarContainer>
          </SidebarProvider>
        );
      case 'NearbyScreen':
        return (
          <SidebarProvider>
            <SidebarContainer>
              <NearbyScreen />
            </SidebarContainer>
          </SidebarProvider>
        );
      case 'DiaryScreen':
        return (
          <SidebarProvider>
            <SidebarContainer>
              <DiaryScreen />
            </SidebarContainer>
          </SidebarProvider>
        );
      default:
        return (
          <SidebarProvider>
            <SidebarContainer>
              <HomeScreen />
            </SidebarContainer>
          </SidebarProvider>
        );
    }
  };

  const value: NavigationContextType = {
    currentScreen,
    navigate,
    goBack,
    params,
  };

  return (
    <NavigationContext.Provider value={value}>
      <GlobalBottomSheetProvider>
        <GlobalModalProvider>
          {renderScreen()}
        </GlobalModalProvider>
      </GlobalBottomSheetProvider>
    </NavigationContext.Provider>
  );
};

