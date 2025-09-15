# WLD WorldShop Client - Complete Project Documentation

## 📋 Project Overview

**WLD WorldShop Client** is a sophisticated React-based e-commerce application that integrates with Worldcoin's ecosystem, featuring WLD token payments, multi-language support, and a comprehensive content management system.

### 🎯 Key Features
- 🌍 **Multi-language Support**: English, Thai, Malay, Filipino, Indonesian
- 💰 **WLD Token Payments**: Integration with Worldcoin MiniKit
- 🛒 **E-commerce Functionality**: Product catalog, shopping cart, checkout
- 📱 **Responsive Design**: Mobile-first approach with dark/light themes
- 🔧 **CMS Integration**: Admin panel for content management
- 🌐 **Country-specific Pricing**: Regional pricing support
- 🔐 **Wallet Authentication**: Worldcoin wallet integration

## 🏗️ Technology Stack

### Frontend Framework
- **React 18.3.1** with TypeScript
- **Vite 5.4.2** for build tooling and development server
- **React Router DOM 7.8.0** for navigation

### State Management
- **Zustand 4.5.2** for global state management
- **SWR 2.3.6** for data fetching and caching
- **Immer 10.1.1** for immutable state updates

### UI & Styling
- **Tailwind CSS 3.4.1** for styling
- **Framer Motion 12.23.12** for animations
- **Lucide React 0.344.0** for icons

### Blockchain Integration
- **@worldcoin/minikit-js 1.9.6** for Worldcoin integration
- **viem 2.34.0** for Ethereum interactions
- **bignumber.js 9.3.1** for precise number calculations

### Internationalization
- **i18next 25.3.6** with React integration
- **i18next-browser-languagedetector 8.2.0** for automatic language detection

### Storage & Persistence
- **IndexedDB (idb 8.0.3)** for client-side storage
- **LocalStorage** for user preferences

## 📁 Project Structure

```
wld-worldshophs-client/
├── src/
│   ├── components/           # React components
│   │   ├── BagScreen/       # Shopping cart interface
│   │   ├── CMS/             # Content management system
│   │   │   ├── Collections/ # Collection management
│   │   │   ├── Products/    # Product management
│   │   │   ├── Users/       # User management
│   │   │   ├── Checkouts/   # Order management
│   │   │   └── Settings/    # CMS settings
│   │   ├── CheckoutScreen/  # Checkout process
│   │   ├── CollectionScreen/# Product collections
│   │   ├── ProductDetailScreen/ # Product details
│   │   ├── checkout/        # Checkout-specific components
│   │   └── minikit-provider/# Worldcoin integration
│   ├── hooks/               # Custom React hooks
│   │   ├── useCart.ts       # Shopping cart logic
│   │   ├── useWLDBalance.ts # WLD token balance
│   │   ├── useCheckout.ts   # Checkout process
│   │   └── useTheme.ts      # Theme management
│   ├── i18n/               # Internationalization setup
│   │   └── index.ts        # Language configurations
│   ├── layouts/            # Layout components
│   │   └── MainLayout.tsx  # Main application layout
│   ├── store/              # Zustand stores
│   │   ├── authStore.ts    # Authentication state
│   │   ├── cartStore.ts    # Shopping cart state
│   │   ├── languageStore.ts# Language preferences
│   │   ├── countryStore.ts # Country selection
│   │   ├── themeStore.ts   # Theme preferences
│   │   └── productStore.ts # Product data
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # All type definitions
│   ├── utils/              # Utility functions
│   │   ├── api.ts          # API service functions
│   │   ├── payment-service.ts # WLD payment integration
│   │   └── orderIdGenerator.ts # Order ID generation
│   └── assets/             # Static assets
├── public/                 # Public assets
├── docs/                   # Documentation files
├── package.json           # Project dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── .env.example           # Environment variables template
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd wld-worldshophs-client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Variables
```env
VITE_API_URL=https://wldshop-api.capybera.xyz
VITE_CMS_USERNAME=holdstation
VITE_CMS_PASSWORD=123@
VITE_APP_ID=app_82b100cfec9be3319fd2dacc711d1530
VITE_WORLDCOIN_API_URL=https://developer.worldcoin.org/api/v1
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:production` - Build with production mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔧 Core Architecture

### Application Entry Point
The main App component sets up routing with three main sections:
- **Public Routes**: Login screen
- **Protected CMS Routes**: Admin panel with authentication
- **Main App Routes**: E-commerce interface with MiniKit integration

### State Management Architecture
The application uses Zustand for state management with multiple specialized stores:

#### Authentication Store (`authStore.ts`)
- **CMS Authentication**: Username/password login for admin panel
- **Worldcoin Authentication**: Wallet-based authentication
- **Auto-login**: Automatic wallet connection on app load
- **User Synchronization**: Backend user data sync

#### Shopping Cart Store (`cartStore.ts`)
- **Cart Management**: Add, remove, update cart items
- **Persistent Storage**: Cart data linked to wallet address
- **Multi-language Support**: Language-aware cart operations
- **Real-time Updates**: Automatic cart synchronization

#### Language Store (`languageStore.ts`)
- **Multi-language Support**: 5 supported languages
- **Persistent Preferences**: Language settings saved locally
- **i18n Integration**: Automatic i18next language switching
- **Country Mapping**: Language-to-country associations

#### Country Store (`countryStore.ts`)
- **Regional Pricing**: Country-specific price calculations
- **Automatic Selection**: Language-based country detection
- **Manual Override**: User can manually select country
- **Pricing Integration**: Seamless price updates

#### Theme Store (`themeStore.ts`)
- **Dark/Light Mode**: System preference detection
- **Manual Toggle**: User-controlled theme switching
- **Persistent Settings**: Theme preferences saved locally

### Component Architecture

#### Main Screens
1. **ExploreScreen**: Product discovery and featured items
2. **CollectionScreen**: Category-based product browsing
3. **ProductDetailScreen**: Detailed product information
4. **BagScreen**: Shopping cart management
5. **CheckoutScreen**: Order placement and payment
6. **HistoryScreen**: Order history and tracking

#### CMS Components
1. **CMSDashboard**: Admin overview and statistics
2. **CollectionsManager**: Product collection management
3. **ProductsManager**: Product catalog administration
4. **UsersManager**: Customer account management
5. **CheckoutsManager**: Order processing and fulfillment
6. **CMSSettings**: System configuration

## 🌍 Internationalization System

### Supported Languages
- **English (en)** - Default language, US flag 🇺🇸
- **Thai (th)** - ไทย, Thailand flag 🇹🇭
- **Malay (ms)** - Bahasa Melayu, Malaysia flag 🇲🇾
- **Filipino (ph)** - Filipino, Philippines flag 🇵🇭
- **Indonesian (id)** - Bahasa Indonesia, Indonesia flag 🇮🇩

### Language-Country Mapping
The application implements intelligent mapping:
- **English → English (en)**
- **Thai → Thailand (th)**
- **Malay → Malaysia (ms)**
- **Filipino → Philippines (ph)**
- **Indonesian → Indonesia (id)**

### Translation Structure
Each language includes translations for:
- Navigation elements
- Product information
- Checkout process
- Error messages
- UI labels and buttons

### Multi-language Content Management
- **Product Translations**: Name, description, material, other details
- **Collection Translations**: Category names and descriptions
- **Country-specific Pricing**: Regional price variations
- **Fallback Logic**: English fallback for missing translations

## 💰 WLD Token Payment Integration

### Payment Configuration
```typescript
PAYMENT_CONSTANTS = {
  WLD_TOKEN: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
  PAYMENT_SERVICE_CONTRACT: "0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b",
  RECIPIENT_ADDRESS: "0x5744c7c3b2825f6478673676015657a9c81594ba",
  WLD_DECIMALS: 18,
}
```

### Payment Process
1. **Balance Check**: Verify sufficient WLD balance
2. **Order Creation**: Generate unique order ID
3. **Payment Execution**: MiniKit transaction processing
4. **Confirmation**: Transaction hash verification
5. **Order Completion**: Backend order creation

### MiniKit Integration
- **Wallet Authentication**: Seamless wallet connection
- **Transaction Signing**: Secure payment processing
- **User Information**: Profile data retrieval
- **Balance Queries**: Real-time WLD balance checking

## 🛒 E-commerce Features

### Product Management
- **Multi-language Products**: Localized product information
- **Country-specific Pricing**: Regional price variations
- **Product Variants**: Size and color options
- **Image Galleries**: Multiple product images
- **Inventory Tracking**: Stock quantity management
- **Featured Products**: Promotional product highlighting

### Shopping Cart System
- **Persistent Cart**: Wallet-linked cart storage
- **Real-time Updates**: Automatic synchronization
- **Multi-language Support**: Localized cart interface
- **Price Calculations**: Dynamic pricing with country support
- **Quantity Management**: Add, remove, update quantities

### Checkout Process
- **Customer Information**: Contact and shipping details
- **Address Validation**: Form validation and error handling
- **Country Selection**: Regional pricing application
- **Payment Processing**: WLD token payment integration
- **Order Confirmation**: Success page with order details

### Order Management
- **Order History**: Customer order tracking
- **Status Updates**: Order progress monitoring
- **Transaction Records**: Payment history and receipts
- **Customer Support**: Order inquiry system

## 🎨 UI/UX Design System

### Theme System
- **Dark/Light Mode**: Automatic system detection
- **Manual Override**: User-controlled theme switching
- **Smooth Transitions**: CSS transitions for theme changes
- **Persistent Preferences**: Theme settings saved locally

### Responsive Design
- **Mobile-first Approach**: Optimized for mobile devices
- **Adaptive Layouts**: Flexible grid systems
- **Touch-friendly Interface**: Large touch targets
- **Cross-platform Compatibility**: Works on all devices

### Animation System
- **Framer Motion**: Smooth page transitions
- **Custom Animations**: Tailwind CSS keyframes
- **Loading States**: Skeleton screens and spinners
- **Interactive Feedback**: Hover and click animations

### Component Library
- **Reusable Components**: Consistent UI elements
- **Accessibility**: ARIA labels and keyboard navigation
- **Form Components**: Validated input fields
- **Modal Systems**: Overlay dialogs and confirmations

## 🔌 API Integration

### API Services
The application integrates with a comprehensive backend API:

#### Collections API
- **GET /api/collections** - Fetch all collections
- **GET /api/cms/collections/multi-language** - Multi-language collections
- **POST /api/collections** - Create new collection
- **PUT /api/collections/:id** - Update collection
- **DELETE /api/collections/:id** - Delete collection

#### Products API
- **GET /api/products** - Fetch products with filtering
- **GET /api/products?id=:id** - Fetch single product
- **POST /api/products** - Create new product
- **PUT /api/products/:id** - Update product
- **DELETE /api/products/:id** - Delete product

#### Cart API
- **GET /api/cart/:walletAddress** - Fetch user cart
- **POST /api/cart/:walletAddress** - Add item to cart
- **PUT /api/cart/:walletAddress/:itemId** - Update cart item
- **DELETE /api/cart/:walletAddress/:itemId** - Remove cart item

#### Checkout API
- **POST /api/checkouts** - Create new order
- **GET /api/checkouts** - Fetch orders (admin)
- **PUT /api/checkouts/:id** - Update order status

#### Users API
- **GET /api/users** - Fetch all users (admin)
- **GET /api/users?walletAddress=:address** - Fetch user by wallet
- **POST /api/users** - Create new user
- **PUT /api/users/:id** - Update user information

### Data Fetching Strategy
- **SWR Integration**: Automatic caching and revalidation
- **Error Handling**: Centralized error processing
- **Loading States**: User-friendly loading indicators
- **Retry Logic**: Automatic retry on failed requests

## 🔒 Security & Authentication

### Authentication Methods
1. **CMS Authentication**: Username/password for admin access
2. **Worldcoin Authentication**: Wallet-based user authentication
3. **Protected Routes**: Route-level access control
4. **Session Management**: Persistent authentication state

### Security Measures
- **Environment Variables**: Sensitive data protection
- **Input Validation**: Form data sanitization
- **Error Handling**: Secure error messages
- **HTTPS Enforcement**: Secure data transmission

### Data Protection
- **Local Storage**: Encrypted sensitive data
- **API Security**: Authenticated API requests
- **User Privacy**: Minimal data collection
- **GDPR Compliance**: Privacy-focused design

## 📱 Mobile Integration

### MiniKit Provider
- **Worldcoin Integration**: Seamless wallet connection
- **Mobile Optimization**: Touch-friendly interface
- **App Installation**: Progressive Web App features
- **Push Notifications**: Order status updates

### Mobile Features
- **Responsive Design**: Mobile-first approach
- **Touch Gestures**: Swipe and tap interactions
- **Offline Support**: Basic offline functionality
- **App-like Experience**: Native app feel

## 🚀 Performance Optimizations

### Caching Strategy
- **SWR Caching**: API response caching
- **Store Persistence**: State persistence across sessions
- **Image Optimization**: Lazy loading and compression
- **Code Splitting**: Route-based code splitting

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Dynamic Imports**: Lazy component loading
- **Asset Optimization**: Minification and compression
- **CDN Integration**: Static asset delivery

### Performance Monitoring
- **Core Web Vitals**: Performance metrics tracking
- **Error Tracking**: Real-time error monitoring
- **User Analytics**: Usage pattern analysis
- **Performance Budgets**: Size and speed limits

## 🧪 Development & Testing

### Development Tools
- **Vite**: Fast development server
- **TypeScript**: Type safety and IntelliSense
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting consistency

### Testing Strategy
- **Component Testing**: React component testing
- **Integration Testing**: API integration testing
- **E2E Testing**: End-to-end user flows
- **Performance Testing**: Load and stress testing

### Debugging Tools
- **React DevTools**: Component inspection
- **Eruda**: Mobile debugging console
- **Network Monitoring**: API request tracking
- **Error Boundaries**: Error catching and reporting

## 📊 Analytics & Monitoring

### User Analytics
- **Google Analytics**: User behavior tracking
- **Custom Events**: Action tracking
- **Conversion Tracking**: Purchase funnel analysis
- **Performance Metrics**: Core Web Vitals monitoring

### Business Intelligence
- **Sales Analytics**: Revenue and order tracking
- **Product Performance**: Popular products analysis
- **User Engagement**: Session duration and interactions
- **Geographic Analysis**: Regional usage patterns

## 🔄 Deployment & DevOps

### Build Process
```bash
# Development build
npm run dev

# Production build
npm run build:production

# Preview build
npm run preview
```

### Deployment Strategy
- **Static Site Hosting**: Optimized for CDN deployment
- **Environment Configuration**: Multi-environment support
- **CI/CD Pipeline**: Automated build and deployment
- **Monitoring**: Real-time application monitoring

### Infrastructure
- **CDN**: Global content delivery
- **Load Balancing**: High availability setup
- **SSL/TLS**: Secure connections
- **Backup Systems**: Data protection and recovery

## 📈 Future Roadmap

### Planned Features
- **Push Notifications**: Real-time order updates
- **Social Features**: Product reviews and ratings
- **Advanced Search**: AI-powered product discovery
- **Loyalty Program**: Customer rewards system
- **Multi-currency**: Additional payment methods

### Technical Improvements
- **PWA Features**: Offline functionality
- **Performance**: Further optimization
- **Accessibility**: Enhanced accessibility features
- **Internationalization**: Additional languages
- **Mobile App**: Native mobile applications

## 🤝 Contributing

### Development Guidelines
- **Code Standards**: TypeScript and ESLint rules
- **Commit Messages**: Conventional commit format
- **Pull Requests**: Code review process
- **Documentation**: Comprehensive documentation updates

### Getting Involved
- **Issue Reporting**: Bug reports and feature requests
- **Code Contributions**: Pull requests welcome
- **Documentation**: Help improve documentation
- **Testing**: Contribute to test coverage

---

**WLD WorldShop Client** represents a comprehensive e-commerce solution with advanced internationalization, blockchain integration, and modern web development practices. This documentation provides a complete overview of the project's architecture, features, and implementation details.

For technical support or questions, please refer to the project repository or contact the development team.

## 📋 Detailed Component Documentation

### Core Components Deep Dive

#### 1. ExploreScreen Component
**Location**: `src/components/ExploreScreen.tsx`
**Purpose**: Main landing page showcasing featured products and collections

**Features**:
- Hero section with promotional content
- Featured products carousel
- Product list with infinite scrolling
- Bottom navigation integration
- Automatic scroll-to-top on mount

**Key Dependencies**:
- `HeroSection` - Promotional banner component
- `ProductList` - Product grid display
- `BottomNavigation` - Mobile navigation bar

#### 2. ProductDetailScreen Component
**Location**: `src/components/ProductDetailScreen/index.tsx`
**Purpose**: Detailed product information and purchase interface

**Features**:
- Image gallery with swipe navigation
- Size selector with availability checking
- Multi-language product information
- Add to cart functionality
- Expandable sections (About, Material, Other Details)
- Country-specific pricing display

**State Management**:
- Product data fetching via `useProductStore`
- Cart operations via `useCart`
- Language preferences via `useLanguageStore`

#### 3. CheckoutScreen Component
**Location**: `src/components/CheckoutScreen/index.tsx`
**Purpose**: Complete checkout process with WLD payment integration

**Features**:
- Customer information form
- Address validation
- Country selection with pricing updates
- WLD balance checking
- Payment processing with MiniKit
- Order confirmation

**Payment Flow**:
1. Form validation
2. WLD balance verification
3. Order ID generation
4. Payment execution via MiniKit
5. Backend order creation
6. Success page redirect

#### 4. CMS Components
**Location**: `src/components/CMS/`
**Purpose**: Administrative interface for content management

**Sub-components**:
- **CMSDashboard**: Overview and statistics
- **CollectionsManager**: Product category management
- **ProductsManager**: Product catalog administration
- **UsersManager**: Customer account management
- **CheckoutsManager**: Order processing
- **CMSSettings**: System configuration

**Multi-language Support**:
- Tabbed translation interface
- Language-specific content editing
- Country-specific pricing management
- Fallback logic for missing translations

### Custom Hooks Documentation

#### 1. useCart Hook
**Location**: `src/hooks/useCart.ts`
**Purpose**: Shopping cart state and operations management

**Features**:
- Cart data fetching and caching
- Add/remove/update cart items
- Total calculations
- Wallet integration
- Multi-language support

**API Integration**:
```typescript
const {
  items,           // Cart items array
  totalAmount,     // Total price calculation
  totalQuantity,   // Total item count
  addToCart,       // Add item function
  removeFromCart,  // Remove item function
  updateQuantity,  // Update quantity function
  clearCart,       // Clear all items
  hasWallet,       // Wallet connection status
  isLoading,       // Loading state
  error            // Error state
} = useCart();
```

#### 2. useWLDBalance Hook
**Location**: `src/hooks/useWLDBalance.ts`
**Purpose**: WLD token balance management and monitoring

**Features**:
- Real-time balance fetching
- Balance formatting and display
- Error handling for balance queries
- Automatic refresh on wallet changes

**Usage**:
```typescript
const {
  balance,         // Current WLD balance
  isLoading,       // Loading state
  error,           // Error state
  refetch          // Manual refresh function
} = useWLDBalance();
```

#### 3. useCheckout Hook
**Location**: `src/hooks/useCheckout.ts`
**Purpose**: Checkout process management

**Features**:
- Order creation
- Payment processing
- Status tracking
- Error handling

### Store Documentation

#### 1. Authentication Store (`authStore.ts`)
**Purpose**: Manages both CMS and Worldcoin authentication

**CMS Authentication**:
```typescript
interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
}
```

**Worldcoin Authentication**:
```typescript
interface AuthWorldStore {
  address: string;
  username: string;
  profile_picture_url?: string | null;
  user?: User | null;
  isUserSyncing: boolean;
}
```

**Auto-login Process**:
1. Check for stored wallet address
2. Attempt MiniKit wallet authentication
3. Fetch user information
4. Sync with backend user system
5. Update authentication state

#### 2. Language Store (`languageStore.ts`)
**Purpose**: Multi-language support and preferences

**Supported Languages**:
```typescript
export const languages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "ph", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
];
```

**Features**:
- Language selection and persistence
- i18next integration
- Language-to-country mapping
- Rehydration on app startup

#### 3. Country Store (`countryStore.ts`)
**Purpose**: Country selection and regional pricing

**Country Options**:
```typescript
export const countries: CountryOption[] = [
  { code: "th", name: "Thailand", flag: "🇹🇭", currency: "THB" },
  { code: "ms", name: "Malaysia", flag: "🇲🇾", currency: "MYR" },
  { code: "ph", name: "Philippines", flag: "🇵🇭", currency: "PHP" },
  { code: "id", name: "Indonesia", flag: "🇮🇩", currency: "IDR" },
];
```

**Language-Country Mapping**:
- Automatic country selection based on language
- Manual override capability
- Pricing calculation integration
- Persistent user preferences

### API Service Documentation

#### 1. Collections API (`utils/api.ts`)
**Endpoints**:
- `GET /api/collections` - Fetch all collections
- `GET /api/cms/collections/multi-language` - Multi-language collections
- `POST /api/collections` - Create collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection

**Multi-language Support**:
```typescript
interface MultiLanguageCollection {
  id: number;
  slug: string;
  isActive: boolean;
  translations: Record<string, CollectionTranslation>;
  availableLanguages: string[];
  defaultLanguage: string;
  metadata: {
    requestedLanguage: string;
    requestedCountry: string | null;
    effectiveLanguage: string;
    effectiveCountry: string | null;
    currency: string;
    hasLanguageFallback: boolean;
    hasCountryFallback: boolean;
  };
}
```

#### 2. Products API
**Endpoints**:
- `GET /api/products` - Fetch products with filtering
- `GET /api/products?id=:id` - Fetch single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Filtering Parameters**:
- `collection` - Filter by collection slug
- `limit` - Number of products per page
- `page` - Page number for pagination
- `lang` - Language code for localization
- `country` - Country code for pricing
- `active` - Filter active/inactive products

**Product Structure**:
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  collection: { id: number; name: string; slug: string; } | null;
  category: string;
  material: string;
  madeBy: string;
  inStock: string;
  featured: boolean;
  active: boolean;
  language: string;
  images: ProductImage[] | null;
  sizes: ProductSize[] | null;
  otherDetails: string;
  // Country-specific pricing
  basePrice: number;
  countryPrice: number | null;
  countryCode: string;
  hasCountrySpecificPrice: boolean;
  currency: string;
  effectivePrice: number;
}
```

#### 3. Cart API
**Endpoints**:
- `GET /api/cart/:walletAddress` - Fetch user cart
- `POST /api/cart/:walletAddress` - Add item to cart
- `PUT /api/cart/:walletAddress/:itemId` - Update cart item
- `DELETE /api/cart/:walletAddress/:itemId` - Remove cart item

**Cart Operations**:
```typescript
// Add to cart
const addToCartRequest: AddToCartRequest = {
  productId: "123",
  size: "M",
  quantity: 1,
  language: "en",
  country: "th"
};

// Cart response
interface CartResponse {
  walletAddress: string;
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  totalAmount: string;
}
```

### Payment Integration Documentation

#### WLD Token Configuration
```typescript
export const PAYMENT_CONSTANTS = {
  WLD_TOKEN: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
  PAYMENT_SERVICE_CONTRACT: "0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b",
  RECIPIENT_ADDRESS: "0x5744c7c3b2825f6478673676015657a9c81594ba",
  WLD_DECIMALS: 18,
};
```

#### Payment Process Flow
1. **Balance Verification**: Check sufficient WLD balance
2. **Order Preparation**: Generate unique order ID
3. **Payment Execution**: MiniKit transaction processing
4. **Transaction Confirmation**: Verify transaction hash
5. **Order Creation**: Backend order record creation
6. **Success Handling**: Redirect to success page

#### MiniKit Integration
```typescript
// Payment execution
const result = await transferByTokenExact({
  amount: amount.toString(),
  orderId: orderId,
});

// Transaction verification
if (result.success) {
  // Handle successful payment
  onPaymentSuccess(result.txHash);
} else {
  // Handle payment failure
  onPaymentError(result.error);
}
```

### Internationalization Implementation

#### Translation Structure
Each language includes comprehensive translations:

**Navigation Elements**:
- explore, bag, history, settings
- Language names and flags
- Menu items and buttons

**Product Information**:
- Product names and descriptions
- Material and detail information
- Size and availability status
- Pricing and currency display

**Checkout Process**:
- Form labels and placeholders
- Validation error messages
- Payment status updates
- Success and failure messages

**Error Handling**:
- API error messages
- Validation feedback
- System notifications
- User guidance text

#### Language Detection
```typescript
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });
```

#### Multi-language Content Management
**Product Translations**:
```typescript
interface ProductTranslation {
  languageCode: string;
  name: string;
  description: string;
  material: string;
  otherDetails: string;
}

// Multi-language product structure
interface MultiLanguageProduct {
  translations: Record<string, ProductTranslation>;
  availableLanguages: string[];
  defaultLanguage: string;
  countryPrices: Record<string, number>;
}
```

**Collection Translations**:
```typescript
interface CollectionTranslation {
  languageCode: string;
  name: string;
  description: string;
}
```

### Theme System Implementation

#### Theme Configuration
```typescript
interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Theme detection
theme: (typeof window !== 'undefined' &&
       window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light'
```

#### CSS Variables
```css
:root {
  --color-primary-50: 248 250 252;
  --color-primary-100: 241 245 249;
  --color-primary-500: 100 116 139;
  --color-primary-900: 15 23 42;
}

.dark {
  --color-primary-50: 15 23 42;
  --color-primary-100: 30 41 59;
  --color-primary-500: 148 163 184;
  --color-primary-900: 248 250 252;
}
```

#### Theme Provider
```typescript
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
```

### Performance Optimization Strategies

#### Caching Implementation
**SWR Configuration**:
```typescript
// Collection caching with 5-minute expiration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Product caching with automatic revalidation
const { data, error, isLoading } = useSWR(
  `/api/products?collection=${collectionSlug}`,
  fetcher,
  {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
  }
);
```

**Store-level Caching**:
```typescript
// Collection store with timestamp-based caching
interface CollectionState {
  collectionProducts: Record<string, Product[]>;
  loadingStates: Record<string, boolean>;
  lastFetched: Record<string, number>;
}

// Cache validation
const isCacheValid = (lastFetched: number) => {
  return Date.now() - lastFetched < CACHE_DURATION;
};
```

#### Code Splitting
```typescript
// Route-based code splitting
const LazyProductDetail = lazy(() => import('./ProductDetailScreen'));
const LazyCheckout = lazy(() => import('./CheckoutScreen'));

// Component lazy loading
const CMS = lazy(() => import('./components/CMS'));
```

#### Image Optimization
```typescript
// Lazy loading implementation
const [imageLoaded, setImageLoaded] = useState(false);

<img
  src={product.images[0]?.url}
  alt={product.name}
  loading="lazy"
  onLoad={() => setImageLoaded(true)}
  className={`transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
/>
```

### Error Handling & Debugging

#### Error Boundaries
```typescript
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

#### API Error Handling
```typescript
// Centralized error processing
export function mergeAPIError(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
}

// Error state management
const [error, setError] = useState<string | null>(null);

try {
  const result = await apiCall();
  setError(null);
} catch (err) {
  setError(mergeAPIError(err));
}
```

#### Development Debugging
```typescript
// Eruda integration for mobile debugging
if (import.meta.env.DEV) {
  import('eruda').then((eruda) => {
    eruda.default.init();
  });
}

// Console logging for development
console.log('🔄 useAutoLogin hook initialized with state:', {
  username,
  address,
  hasUser: !!user,
});
```

### Security Implementation

#### Environment Variable Management
```typescript
// Secure configuration
export const CONSTANT = {
  API_URL: import.meta.env.VITE_API_URL,
  CMS_USERNAME: import.meta.env.VITE_CMS_USERNAME,
  CMS_PASSWORD: import.meta.env.VITE_CMS_PASSWORD,
  APP_ID: import.meta.env.VITE_APP_ID,
  WORLDCOIN_API_URL: import.meta.env.VITE_WORLDCOIN_API_URL,
};
```

#### Authentication Protection
```typescript
// Protected route implementation
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

#### Input Validation
```typescript
// Form validation
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid';
  }

  if (!formData.firstName.trim()) {
    newErrors.firstName = 'First name is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Testing & Quality Assurance

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### ESLint Configuration
```javascript
export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  }
);
```

#### Development Testing
```typescript
// Component testing patterns
const TestComponent = () => {
  const { items, addToCart } = useCart();

  return (
    <div data-testid="cart-component">
      <span data-testid="item-count">{items.length}</span>
      <button
        data-testid="add-button"
        onClick={() => addToCart({ productId: '1', size: 'M' })}
      >
        Add to Cart
      </button>
    </div>
  );
};
```

### Deployment & Production

#### Build Configuration
```typescript
// Vite production configuration
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
```

#### Production Optimizations
```bash
# Production build with optimizations
npm run build:production

# Bundle analysis
npm run analyze

# Performance testing
npm run lighthouse
```

#### Environment Setup
```env
# Production environment variables
VITE_API_URL=https://api.worldshop.com
VITE_APP_ID=app_production_id
VITE_WORLDCOIN_API_URL=https://developer.worldcoin.org/api/v1

# Development environment variables
VITE_API_URL=http://localhost:8086
VITE_APP_ID=app_development_id
```

---

This comprehensive documentation covers all aspects of the WLD WorldShop Client project, from high-level architecture to detailed implementation specifics. The project represents a sophisticated e-commerce platform with advanced features including multi-language support, blockchain payment integration, and modern web development practices.
