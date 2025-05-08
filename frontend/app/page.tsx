import Image from "next/image";
import AuthGuard from "./components/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <div className="flex justify-center items-center h-screen text-2xl">
      
        
      </div>
    </AuthGuard>
  );
}
