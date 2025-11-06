import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

// Theme types
export type Theme = 'light' | 'dark';

interface Colors {
  // Background colors
  background: {
    primary: string;        // Main background
    secondary: string;      // Legacy: maps to primary200 (card backgrounds)
    primary100: string;     // Lightest/darkest background
    primary200: string;     // Card backgrounds
    primary300: string;     // Secondary backgrounds
    primary500: string;     // Elevated surfaces
    primary600: string;     // Borders
    tabBar: string;         // Tab bar background
  };
  // Text colors
  text: {
    primary: string;        // Primary text
    muted: string;          // Secondary text (mutedTextColor)
    secondary: string;      // Muted text (textSecondary)
  };
  // Grays
  gray: {
    default: string;        // gray
    light: string;          // gray100
  };
  // Brand colors (same in both modes)
  brand: {
    blue: string;
    blue100: string;
    cyan: string;
    purple: string;
    purpleDark: string;
    magenta: string;
    orange: string;
    greenLight: string;
    green: string;
    red: string;
    pink: string;
    persianRed: string;
    darkGreen: string;
    yellow: string;
  };
  // Sidebar colors
  sidebar: {
    background: string;
    overlay: string;
    border: string;
    shadow: string;
  };
  // Legacy support (mapped to new structure)
  primary: {
    500: string;            // Maps to brand.blue for compatibility
  };
  border: {
    primary: string;        // Maps to background.primary600
  };
}

interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface Typography {
  fontFamily: string;
  h1: {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    color?: string;
  };
  h2: {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    color?: string;
  };
  h3: {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    color?: string;
  };
  body: {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    color?: string;
  };
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: Colors;
  spacing: Spacing;
  typography: Typography;
}

const lightColors: Colors = {
  // Background colors
  background: {
    primary: '#FFFFFF',      // Main background
    secondary: '#F9F9F9',    // Legacy: maps to primary200 (card backgrounds)
    primary100: '#F5F5F5',   // Lightest background
    primary200: '#F9F9F9',   // Card backgrounds
    primary300: '#F0F0F0',   // Secondary backgrounds
    primary500: '#E8E8E8',   // Elevated surfaces
    primary600: '#D0D0D0',   // Borders
    tabBar: '#FFFFFF',       // Tab bar background
  },
  // Text colors
  text: {
    primary: '#000000',                    // Primary text
    muted: 'rgba(0, 0, 0, 0.6)',          // Secondary text
    secondary: 'rgba(0, 0, 0, 0.3)',      // Muted text
  },
  // Grays
  gray: {
    default: 'rgba(0, 0, 0, 0.5)',
    light: 'rgba(0, 0, 0, 0.05)',
  },
  // Brand colors (same in both modes)
  brand: {
    blue: '#7A40F8',
    blue100: '#6BB0f5',
    cyan: '#4cc9f0',
    purple: '#C3B1E1',
    purpleDark: '#C459F4',
    magenta: '#F49AC2',
    orange: '#fdac1d',
    greenLight: '#00ECCA',
    green: '#7fff62',
    red: '#ef3e55',
    pink: '#f72585',
    persianRed: '#C44536',
    darkGreen: '#297e2b',
    yellow: '#E0FF55',
  },
  // Sidebar colors
  sidebar: {
    background: 'rgba(249, 249, 249, 0.95)',
    overlay: 'rgba(0, 0, 0, 0.3)',
    border: 'rgba(208, 208, 208, 0.3)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  // Legacy support
  primary: {
    500: '#7A40F8', // Maps to brand.blue
  },
  border: {
    primary: '#D0D0D0', // Maps to background.primary600
  },
};

const darkColors: Colors = {
  // Background colors
  background: {
    primary: '#262938',      // Main background
    secondary: '#2B2C3E',    // Legacy: maps to primary200 (card backgrounds)
    primary100: 'rgb(8, 8, 8)', // Darkest background
    primary200: '#2B2C3E',   // Card backgrounds
    primary300: '#2E2F40',   // Secondary backgrounds
    primary500: '#363747',   // Elevated surfaces
    primary600: '#3f4152',   // Borders
    tabBar: '#07070F',       // Tab bar background
  },
  // Text colors
  text: {
    primary: '#FFFFFF',                    // Primary text
    muted: 'rgba(255, 255, 255, 0.5)',    // Secondary text
    secondary: 'rgba(255, 255, 255, 0.3)', // Muted text
  },
  // Grays
  gray: {
    default: 'rgba(225, 225, 225, 0.5)',
    light: 'rgba(225, 225, 225, 0.05)',
  },
  // Brand colors (same in both modes)
  brand: {
    blue: '#7A40F8',
    blue100: '#6BB0f5',
    cyan: '#4cc9f0',
    purple: '#C3B1E1',
    purpleDark: '#C459F4',
    magenta: '#F49AC2',
    orange: '#fdac1d',
    greenLight: '#00ECCA',
    green: '#7fff62',
    red: '#ef3e55',
    pink: '#f72585',
    persianRed: '#C44536',
    darkGreen: '#297e2b',
    yellow: '#E0FF55',
  },
  // Sidebar colors
  sidebar: {
    background: 'rgba(43, 44, 62, 0.95)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    border: 'rgba(63, 65, 82, 0.3)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  // Legacy support
  primary: {
    500: '#7A40F8', // Maps to brand.blue
  },
  border: {
    primary: '#3f4152', // Maps to background.primary600
  },
};

const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const createTypography = (textColor: string, fontFamily: string = 'Urbanist'): Typography => ({
  fontFamily,
  h1: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Urbanist_700Bold',
    color: textColor,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Urbanist_600SemiBold',
    color: textColor,
  },
  h3: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Urbanist_500Medium',
    color: textColor,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Urbanist_400Regular',
    color: textColor,
  },
});

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;
  const typography = createTypography(colors.text.primary, 'Urbanist');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, spacing, typography }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

