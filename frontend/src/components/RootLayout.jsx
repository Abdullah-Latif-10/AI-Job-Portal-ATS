import { Outlet } from "react-router-dom";
import { Toaster } from "./ui/sonner";

// Import your app styles sheet globally here
import "../styles.css";

export default function RootLayout() {
  return (
    <>
      <div className="animate-page-enter">
        {/* Render nested child route views seamlessly */}
        <Outlet />
      </div>
      <Toaster position="top-center" />
    </>
  );
}