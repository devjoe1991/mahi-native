import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserData } from '../screens/userProfileScreen/types';
import { MOCK_USER_DATA } from '../data/user';

interface AuthContextType {
  userData: UserData | null;
  isAuthenticated: boolean;
  authenticate: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserData: (updates: Partial<UserData>) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(MOCK_USER_DATA);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Start as authenticated with mock data

  /**
   * Authenticate user with email and password
   * In real app, this would call Supabase Auth
   */
  const authenticate = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In real app, use Supabase Auth:
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) throw error;
      // const user = await fetchUserProfile(data.user.id);
      
      // For now, use mock data
      setUserData(MOCK_USER_DATA);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  /**
   * Logout user
   * In real app, this would call Supabase Auth signOut
   */
  const logout = useCallback(() => {
    // In real app: await supabase.auth.signOut();
    setUserData(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Update user data
   * In real app, this would update Supabase profiles table
   */
  const updateUserData = useCallback(async (updates: Partial<UserData>): Promise<boolean> => {
    try {
      if (!userData) {
        throw new Error('No user data to update');
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, use Supabase:
      // const { error } = await supabase
      //   .from('profiles')
      //   .update(updates)
      //   .eq('id', userData._id);
      // if (error) throw error;

      // Update local state
      setUserData((prev) => (prev ? { ...prev, ...updates } : null));
      return true;
    } catch (error) {
      console.error('Update user data failed:', error);
      return false;
    }
  }, [userData]);

  /**
   * Refresh user data from server
   * In real app, this would fetch from Supabase
   */
  const refreshUserData = useCallback(async (): Promise<void> => {
    try {
      if (!userData?._id) return;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In real app, use Supabase:
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select('*')
      //   .eq('id', userData._id)
      //   .single();
      // if (error) throw error;
      // setUserData(data);

      // For now, just refresh with mock data
      setUserData(MOCK_USER_DATA);
    } catch (error) {
      console.error('Refresh user data failed:', error);
    }
  }, [userData?._id]);

  const value: AuthContextType = {
    userData,
    isAuthenticated,
    authenticate,
    logout,
    updateUserData,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

