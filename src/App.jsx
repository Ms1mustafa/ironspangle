import { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import SideBar from "./pages/SideBar.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const logo = import.meta.env.VITE_REACT_APP_PUBLIC_URL;
  return (
    <>
      <div className="bg-white h-full grid grid-cols-[auto,1fr]">
        <Toaster position="top-right" />
        <SideBar logo={logo} />
        <Outlet />
      </div>
    </>
  );
}

export default App;
