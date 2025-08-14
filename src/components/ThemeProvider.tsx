import { ReactNode, useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useThemeStore();
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}