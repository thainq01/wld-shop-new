import { HeroSection } from "./HeroSection";
import { FeaturedProducts } from "./FeaturedProducts";
import { ProductList } from "./ProductList";
import { BottomNavigation } from "./BottomNavigation";
import { RightSidebar } from "./RightSidebar";
import { useEffect, useState } from "react";

export function ExploreScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  // Note: Data caching is now handled by the collection store.
  // When users navigate back to this screen, cached data will be used
  // and no API calls will be made unless the cache is expired (5 minutes)
  // or explicitly refreshed.

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="pb-20">
        <HeroSection onMenuClick={() => setIsSidebarOpen(true)} />
        <FeaturedProducts />
        <ProductList />
      </div>
      <BottomNavigation />

      {/* Right Sidebar */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}
