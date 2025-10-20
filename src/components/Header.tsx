import { X, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthWorld } from "../store/authStore";
import { useShallow } from "zustand/react/shallow";
import { LoginButton } from "./LoginButton";
import { Language } from "./Language";
import { ThemeMode } from "./ThemeMode";

export function Header() {
  const { address, username } = useAuthWorld(
    useShallow((state) => ({
      address: state.address,
      username: state.username,
    }))
  );

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
        {address && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {username}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-row items-center justify-end gap-2">
          <Language />
          <ThemeMode />
        </div>
        {!address ? (
          <div className="flex items-center gap-2">
            <LoginButton />
          </div>
        ) : (
          <>
            <Link
              to="/cms"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
              title="CMS Admin"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {username}
              </span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
