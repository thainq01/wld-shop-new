import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { MainLayout } from "./layouts/MainLayout";
import { ExploreScreen } from "./components/ExploreScreen";
import { CollectionScreen } from "./components/CollectionScreen";
import { ProductDetailScreen } from "./components/ProductDetailScreen";
import { BagScreen } from "./components/BagScreen";
import { ThemeProvider } from "./components/ThemeProvider";
import {
  CMSLayout,
  CMSDashboard,
  CollectionsManager,
  ProductsManager,
  UsersManager,
  CMSSettings,
  CheckoutsManager,
} from "./components/CMS";
import { LoginScreen } from "./components/LoginScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";
import MiniKitProvider from "./components/minikit-provider/minikit-provider";
import { Container } from "./container";
import { CheckoutScreen } from "./components/CheckoutScreen";
import OrderSuccessScreen from "./components/OrderSuccessScreen";
import HistoryScreen from "./components/HistoryScreen";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<LoginScreen />} />

          {/* Protected CMS Routes */}
          <Route
            path="/cms"
            element={
              <ProtectedRoute>
                <CMSLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CMSDashboard />} />
            <Route path="collections" element={<CollectionsManager />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="checkouts" element={<CheckoutsManager />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="settings" element={<CMSSettings />} />
          </Route>

          {/* Main app routes with layout */}
          <Route
            path="/*"
            element={
              <MiniKitProvider>
                <Container>
                  <MainLayout>
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate to="/explore" replace />}
                      />
                      <Route path="/explore" element={<ExploreScreen />} />
                      <Route
                        path="/collection/:collectionId"
                        element={<CollectionScreen />}
                      />
                      <Route
                        path="/product/:productId"
                        element={<ProductDetailScreen />}
                      />
                      <Route path="/bag" element={<BagScreen />} />
                      <Route path="/history" element={<HistoryScreen />} />
                      <Route path="/checkout" element={<CheckoutScreen />} />
                      <Route path="/order-success" element={<OrderSuccessScreen />} />
                    </Routes>
                  </MainLayout>
                </Container>
              </MiniKitProvider>
            }
          />
        </Routes>
        <Toaster position="top-center" richColors duration={1000} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
