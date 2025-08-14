import { MainLayout } from "./layouts/MainLayout";
import { ExploreScreen } from "./components/ExploreScreen";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <ExploreScreen />
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
