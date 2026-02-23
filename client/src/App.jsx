import { Toaster } from "sonner";
import RootRouter from "./router/RootRouter";
import AuthContextProvider from "./contexts/AuthContext/AuthContextProvider"

function App() {
  // console.log(import.meta.env.VITE_API_URL)
  return (
    <AuthContextProvider>
      <Toaster position="top-center" richColors="true" visibleToasts={3} />
      <RootRouter />
    </AuthContextProvider>
  );
}

export default App;
