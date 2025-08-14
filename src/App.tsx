import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { ExploreScreen } from "./components/ExploreScreen";
import { CollectionScreen } from "./components/CollectionScreen/index";
import { ProductDetailScreen } from "./components/ProductDetailScreen/index";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/explore" replace />} />
            <Route path="/explore" element={<ExploreScreen />} />
            <Route
              path="/collection/:collectionId"
              element={<CollectionScreen />}
            />
            <Route
              path="/product/:productId"
              element={<ProductDetailScreen />}
            />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
