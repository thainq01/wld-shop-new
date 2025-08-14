import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md transition-colors duration-200 ease-in-out
                 dark:bg-gray-800 dark:hover:bg-gray-700 
                 bg-gray-200 hover:bg-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </button>
  );
}
