import { Toaster } from "sonner";
import RootRouter from "./router/RootRouter";
import AuthContextProvider from "./contexts/AuthContext/AuthContextProvider";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthContextProvider>
        <Toaster
          position="top-center"
          richColors="true"
          visibleToasts={3}
          theme="dark"
          toastOptions={{
            style: {
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 300,
              letterSpacing: "-0.01em",
            },
          }}
          duration={300}
        />
        <RootRouter />
      </AuthContextProvider>
    </ErrorBoundary>
  );
}

export default App;
