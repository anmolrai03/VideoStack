import { Toaster } from "sonner";
import RootRouter from "./router/RootRouter";
import AuthContextProvider from "./contexts/AuthContext/AuthContextProvider";

function App() {
  // console.log(import.meta.env.VITE_API_URL)
  return (
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
      />
      <RootRouter />
    </AuthContextProvider>
  );
}

export default App;
