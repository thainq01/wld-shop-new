import { HeroSection } from "./HeroSection";
import { ProductList } from "./ProductList";
import { BottomNavigation } from "./BottomNavigation";

export function ExploreScreen() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="pb-20">
        <HeroSection />
        <ProductList />
      </div>
      <BottomNavigation />
    </div>
  );
}
