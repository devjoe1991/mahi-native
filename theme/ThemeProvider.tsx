import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

// Theme types
export type Theme = 'light' | 'dark';

interface Colors {
  primary: {
    500: string;
  };
  background: {
    primary: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  border: {
    primary: string;
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
  primary: {
    500: '#2176AE', // Spirit Blue (matches screenshot)
  },
  background: {
    primary: '#F8F8F8', // Light Gray (matches screenshot)
    secondary: '#FFFBEB', // Light Yellow (matches screenshot)
  },
  text: {
    primary: '#333333', // Shadow Gray
    secondary: '#666666', // Lighter gray for subtitles
  },
  border: {
    primary: '#E5E7EB',
  },
};

const darkColors: Colors = {
  primary: {
    500: '#2176AE', // Spirit Blue (matches light theme)
  },
  background: {
    primary: '#111827',
    secondary: '#1F2937',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
  },
  border: {
    primary: '#374151',
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

