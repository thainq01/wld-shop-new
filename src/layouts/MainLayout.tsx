import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const isCMSPage = location.pathname === "/cms";

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 hide-scrollbar">
      <div className="relative w-full overflow-hidden hide-scrollbar">
        {children}
      </div>
    </div>
  );
}
