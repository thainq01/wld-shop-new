import { ChevronRight } from "lucide-react";
import { Product } from "../types";

const products: Product[] = [
  {
    id: "1",
    name: "Unique Human Oversized Hoodie",
    price: 60.0,
    image: "hoodie",
    availability: "Available",
    category: "Core Collection",
  },
  {
    id: "2",
    name: "Unique Human T-Shirt",
    price: 30.0,
    image: "tshirt",
    availability: "Available",
    category: "Core Collection",
  },
  {
    id: "3",
    name: "Unique Human Hat",
    price: 25.0,
    image: "hat",
    availability: "Available",
    category: "Core Collection",
  },
  {
    id: "4",
    name: "Unique Human Hat",
    price: 25.0,
    image: "hat",
    availability: "Available",
    category: "Core Collection",
  },
  {
    id: "5",
    name: "Unique Human Hat",
    price: 25.0,
    image: "hat",
    availability: "Available",
    category: "Core Collection",
  },
  {
    id: "6",
    name: "Unique Human Hat",
    price: 25.0,
    image: "hat",
    availability: "Available",
    category: "Core Collection",
  },
];

function ProductImage({ type }: { type: string }) {
  const baseClasses = "w-full h-full bg-black flex items-center justify-center";

  switch (type) {
    case "hoodie":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-16 h-10 bg-black border-2 border-gray-600 rounded-t-full"></div>
            <div className="w-20 h-16 bg-black border-2 border-gray-600 rounded-t-2xl -mt-1"></div>
            <div className="absolute top-3 -left-3 w-6 h-12 bg-black border-2 border-gray-600 rounded-l-xl"></div>
            <div className="absolute top-3 -right-3 w-6 h-12 bg-black border-2 border-gray-600 rounded-r-xl"></div>
          </div>
        </div>
      );
    case "tshirt":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-16 h-20 bg-black border-2 border-gray-600 rounded-t-lg"></div>
            <div className="absolute -top-2 -left-4 w-6 h-8 bg-black border-2 border-gray-600 rounded-t-lg"></div>
            <div className="absolute -top-2 -right-4 w-6 h-8 bg-black border-2 border-gray-600 rounded-t-lg"></div>
          </div>
        </div>
      );
    case "hat":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-16 h-8 bg-black border-2 border-gray-600 rounded-full"></div>
            <div className="w-20 h-2 bg-black border-2 border-gray-600 rounded-full mt-1"></div>
          </div>
        </div>
      );
    default:
      return <div className={baseClasses}></div>;
  }
}

export function ProductList() {
  return (
    <div className="px-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Core Collection
        </h3>
        <button className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          See all
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-1">
            {/* Product Image */}
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden flex-shrink-0">
              <ProductImage type={product.image} />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-blue-500 dark:text-blue-400 font-medium mb-1">
                {product.availability}
              </div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                {product.name}
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                USD {product.price.toFixed(2)}
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
