import { Outlet } from "react-router-dom";

import SideBar from "./pages/SideBar.jsx";
import Navbar from "./pages/Navbar.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const logo = import.meta.env.VITE_REACT_APP_PUBLIC_URL;
  return (
    <>
      <div className="bg-[#fff4ea] flex h-screen">
        {/* Sidebar */}
        <SideBar logo={logo} className="w-[250px] flex-shrink-0 h-full" />

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <div className="p-8 pl-0">
            <Navbar className="bg-white w-full z-30" />
          </div>

          {/* Content area with outlet */}
          <div className="flex-1 overflow-auto p-4">
            <Outlet />
            <Toaster position="top-right" />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
