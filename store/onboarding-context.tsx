import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: Date | null;
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general' | null;
  contactsPermission: boolean;
  calendarPermission: boolean;
  cameraPermission: boolean;
  microphonePermission: boolean;
  otpCode?: string;
  otpVerified: boolean;
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  updateOnboardingData: (updates: Partial<OnboardingData>) => void;
  resetOnboardingData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

const defaultOnboardingData: OnboardingData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: undefined,
  dateOfBirth: null,
  fitnessGoal: null,
  contactsPermission: false,
  calendarPermission: false,
  cameraPermission: false,
  microphonePermission: false,
  otpCode: undefined,
  otpVerified: false,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const updateOnboardingData = useCallback((updates: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetOnboardingData = useCallback(() => {
    setOnboardingData(defaultOnboardingData);
    setCurrentStep(0);
  }, []);

  const value: OnboardingContextType = {
    onboardingData,
    updateOnboardingData,
    resetOnboardingData,
    currentStep,
    setCurrentStep,
    totalSteps: 6, // Name, Email/Phone, OTP, DOB, Fitness Goals, Privacy
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

