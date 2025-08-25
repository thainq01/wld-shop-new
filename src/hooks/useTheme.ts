import { useThemeStore } from '../store/themeStore';

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  const switchTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
  };

  return {
    theme,
    switchTheme,
    toggleTheme,
  };
}
