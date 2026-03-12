import {useState, useEffect} from "react";
import Navbar from "../components/NavBar/NavBar";
import Loading from "./Loading/Loading";

function Test() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a 2-3 second delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5500); // 2.5 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  if (isLoading) {
    return <Loading />; // Show loading animation
  }
  return (
    <div className="min-h-screen bg-background">

      <main className="px-12 py-16 space-y-10">
        <h1 className="text-5xl max-w-xl">
          Your gateway to seamless video processing
        </h1>

        <button className="vs-btn">Upload Video →</button>
      </main>
    </div>
  );
}

export default Test;
