import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useCookies } from "react-cookie";
import AuthCheck from "../API/account/AuthCheck";
import "primeicons/primeicons.css";

export default function SideBar({ logo }) {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const user = AuthCheck(); // Assuming AuthCheck returns user info

  // State to manage section visibility
  const [sectionsOpen, setSectionsOpen] = useState({
    projects: false,
    applications: false,
    admin: false,
    mec: false,
    supplyChain: false,
  });

  // Function to toggle section visibility
  const toggleSection = (section) => {
    setSectionsOpen((prevSectionsOpen) => ({
      // ...prevSectionsOpen,
      [section]: !prevSectionsOpen[section],
    }));
  };

  const handleLogout = () => {
    removeCookie("token", { path: "/" });
    navigate("/login", { replace: true });
  };

  return (
    <>
      <aside className="no-scrollbar relative flex flex-col h-screen overflow-y-scroll pb-8 lg:w-[250px] w-[250px] transition-all duration-300 ease-in-out m-0 z-40 inset-y-0 left-0 border-r border-r-dashed border-r-neutral-200 sidenav fixed-start loopple-fixed-start">
        <div className="relative">
          <div className="flex flex-col w-full font-medium">
            <div className="flex flex-row gap-3 items-center border-b-2 ">
              <img src={logo} alt="logo" className="w-32" />
            </div>
            <div className="pt-5">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "navLink bg-[#00427f] text-slate-50"
                    : "navLink text-slate-400 hover:bg-gray-50"
                }
              >
                Dashboard
              </NavLink>
            </div>

            {/* Projects Section */}
            <div className="block pt-5 pb-[.15rem]">
              <div
                className="px-4 py-[.65rem] cursor-pointer flex justify-between"
                onClick={() => toggleSection("projects")}
              >
                <span className="text-[#00427f] font-semibold text-[0.95rem] uppercase dark:text-neutral-500/80 text-secondary-dark">
                  Projects
                </span>
                <span>
                  {sectionsOpen.projects ? (
                    <i className="pi pi-angle-up text-[#00427f] text-xs"></i>
                  ) : (
                    <i className="pi pi-angle-down text-[#00427f] text-xs"></i>
                  )}
                </span>
              </div>
              <div
                className={`section-content ${
                  sectionsOpen.projects ? "open" : ""
                }`}
              >
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    isActive
                      ? "navLink bg-[#00427f] text-slate-50"
                      : "navLink text-slate-400 hover:bg-gray-50"
                  }
                >
                  Projects List
                </NavLink>
              </div>
            </div>

            {/* Applications Section */}
            <div className="block pt-5 pb-[.15rem]">
              <div
                className="px-4 py-[.65rem] cursor-pointer flex justify-between"
                onClick={() => toggleSection("applications")}
              >
                <span className="text-[#00427f] font-semibold text-[0.95rem] uppercase dark:text-neutral-500/80 text-secondary-dark">
                  Applications
                </span>
                <span>
                  {sectionsOpen.applications ? (
                    <i className="pi pi-angle-up text-[#00427f] text-xs"></i>
                  ) : (
                    <i className="pi pi-angle-down text-[#00427f] text-xs"></i>
                  )}
                </span>
              </div>
              <div
                className={`section-content ${
                  sectionsOpen.applications ? "open" : ""
                }`}
              >
                <NavLink
                  to="/test"
                  className={({ isActive }) =>
                    isActive
                      ? "navLink bg-[#00427f] text-slate-50"
                      : "navLink text-slate-400 hover:bg-gray-50"
                  }
                >
                  Company Expenses
                </NavLink>
                <NavLink
                  to="/test"
                  className={({ isActive }) =>
                    isActive
                      ? "navLink bg-[#00427f] text-slate-50"
                      : "navLink text-slate-400 hover:bg-gray-50"
                  }
                >
                  Lafarge Expenses
                </NavLink>
                <NavLink
                  to="/test"
                  className={({ isActive }) =>
                    isActive
                      ? "navLink bg-[#00427f] text-slate-50"
                      : "navLink text-slate-400 hover:bg-gray-50"
                  }
                >
                  PPE
                </NavLink>
                <NavLink
                  to="/test"
                  className={({ isActive }) =>
                    isActive
                      ? "navLink bg-[#00427f] text-slate-50"
                      : "navLink text-slate-400 hover:bg-gray-50"
                  }
                >
                  SD
                </NavLink>
              </div>
            </div>

            {/* Admin Section */}
            <div className="block pt-5 pb-[.15rem]">
              <div
                className="px-4 py-[.65rem] cursor-pointer flex justify-between"
                onClick={() => toggleSection("admin")}
              >
                <span className="text-[#00427f] font-semibold text-[0.95rem] uppercase dark:text-neutral-500/80 text-secondary-dark">
                  Admin
                </span>
                <span>
                  {sectionsOpen.admin ? (
                    <i className="pi pi-angle-up text-[#00427f] text-xs"></i>
                  ) : (
                    <i className="pi pi-angle-down text-[#00427f] text-xs"></i>
                  )}
                </span>
              </div>
              <div
                className={`section-content ${
                  sectionsOpen.admin ? "open" : ""
                }`}
              >
                <NavLink
                  to="/test"
                  className={({ isActive }) =>
                    isActive
                      ? "navLink bg-[#00427f] text-slate-50"
                      : "navLink text-slate-400 hover:bg-gray-50"
                  }
                >
                  Admin Management
                </NavLink>
                <NavLink
                  to="/test"
                  className={({ isActive }) =>
                    isActive
                      ? "navLink bg-[#00427f] text-slate-50"
                      : "navLink text-slate-400 hover:bg-gray-50"
                  }
                >
                  Admin Workers
                </NavLink>
              </div>
            </div>

            {/* MEC Section */}
            <div className="block pt-5 pb-[.15rem]">
              <div
                className="px-4 py-[.65rem] cursor-pointer flex justify-between"
                onClick={() => toggleSection("mec")}
              >
                <span className="text-[#00427f] font-semibold text-[0.95rem] uppercase dark:text-neutral-500/80 text-secondary-dark">
                  MEC
                </span>
                <span>
                  {sectionsOpen.mec ? (
                    <i className="pi pi-angle-up text-[#00427f] text-xs"></i>
                  ) : (
                    <i className="pi pi-angle-down text-[#00427f] text-xs"></i>
                  )}
                </span>
              </div>
              <div
                className={`section-content ${sectionsOpen.mec ? "open" : ""}`}
              >
                <NavLink
                  to="/test"
                  className={({ isActive }) =>
                    isActive
                      ? "navLink bg-[#00427f] text-slate-50"
                      : "navLink text-slate-400 hover:bg-gray-50"
                  }
                >
                  MEC Management
                </NavLink>
                <NavLink
                  to="/test"
                  className={({ isActive }) =>
                    isActive
                      ? "navLink bg-[#00427f] text-slate-50"
                      : "navLink text-slate-400 hover:bg-gray-50"
                  }
                >
                  MEC Workers
                </NavLink>
              </div>
            </div>

            {/* Supply Chain Section */}
            <div className="block pt-5 pb-[.15rem]">
              <div
                className="px-4 py-[.65rem] cursor-pointer flex justify-between"
                onClick={() => toggleSection("supplyChain")}
              >
                <span className="text-[#00427f] font-semibold text-[0.95rem] uppercase dark:text-neutral-500/80 text-secondary-dark">
                  supply chain
                </span>
                <span>
                  {sectionsOpen.supplyChain ? (
                    <i className="pi pi-angle-up text-[#00427f] text-xs"></i>
                  ) : (
                    <i className="pi pi-angle-down text-[#00427f] text-xs"></i>
                  )}
                </span>
              </div>
              <div
                className={`section-content ${
                  sectionsOpen.supplyChain ? "open" : ""
                }`}
              >
                <NavLink
                  to="/test"
                  className={({ isActive }) =>
                    isActive
                      ? "navLink bg-[#00427f] text-slate-50"
                      : "navLink text-slate-400 hover:bg-gray-50"
                  }
                >
                  SH Management
                </NavLink>
                <NavLink
                  to="/test"
                  className={({ isActive }) =>
                    isActive
                      ? "navLink bg-[#00427f] text-slate-50"
                      : "navLink text-slate-400 hover:bg-gray-50"
                  }
                >
                  SH Workers
                </NavLink>
              </div>
            </div>

            <div className=" mt-6 px-4">
              <Button
                className="bg-red-500 hover:bg-red-600 w-24"
                onClick={handleLogout}
              >
                logout
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
