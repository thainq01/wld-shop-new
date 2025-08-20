import { X, MoreHorizontal, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 ">
      <button className="p-2 -ml-2">
        <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-800 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white dark:bg-gray-300 rounded-full"></div>
        </div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          World Shop
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          to="/cms"
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          title="CMS Admin"
        >
          <Settings className="w-5 h-5" />
        </Link>
        <button className="p-2 -mr-2">
          <MoreHorizontal className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </header>
  );
}
