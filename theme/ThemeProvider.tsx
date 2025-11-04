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
  h1: {
    fontSize: number;
    fontWeight: string;
    color?: string;
  };
  h2: {
    fontSize: number;
    fontWeight: string;
    color?: string;
  };
  body: {
    fontSize: number;
    fontWeight: string;
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
    500: '#0077B6', // Spirit Blue
  },
  background: {
    primary: '#F5F5F5', // Aura White
    secondary: '#FFFDD0', // Vapor Cream
  },
  text: {
    primary: '#333333', // Shadow Gray
    secondary: '#6B7280',
  },
  border: {
    primary: '#E5E7EB',
  },
};

const darkColors: Colors = {
  primary: {
    500: '#0077B6', // Spirit Blue
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

const createTypography = (textColor: string): Typography => ({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    color: textColor,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    color: textColor,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
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
  const typography = createTypography(colors.text.primary);

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

