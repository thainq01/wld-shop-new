import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 hide-scrollbar">
      <div className="max-w-sm mx-auto relative overflow-hidden hide-scrollbar">
        {children}
      </div>
    </div>
  );
}
