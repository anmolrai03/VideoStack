import { Toaster } from "sonner";
import RootRouter from "./router/RootRouter";

function App() {
  // console.log(import.meta.env.VITE_API_URL)
  return (
    <>
      <Toaster position="top-center" richColors="true" visibleToasts={3} />
      <RootRouter />
    </>
  );
}

export default App;
