import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "primeicons/primeicons.css";
import {
  AlignEndVertical,
  FolderKanban,
  House,
  LogOut,
  UsersRound,
  WalletMinimal,
} from "lucide-react";

export default function SideBar({ logo }) {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  // State to manage section visibility
  const [sectionsOpen, setSectionsOpen] = useState({
    projects: false,
    expenses: false,
    contractor: false,
    admin: false,
    mec: false,
    supplyChain: false,
    accounting: false,
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
      <aside className="flex flex-col h-screen p-8 pr-1 lg:w-[270px] w-[250px] transition-all duration-300 ease-in-out m-0 z-40 inset-y-0 left-0 rounded-2xl">
        <div className="flex flex-col custom-scrollbar bg-white overflow-y-auto rounded-3xl h-full w-full p-5 font-medium">
          <div className="flex flex-row gap-3 items-center justify-center">
            <img src={logo} alt="logo" className="w-28" />
          </div>
          <div>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `navLink rounded-lg text-md font-normal flex items-center place-content-around ${
                  isActive
                    ? "bg-main text-slate-50"
                    : "text-slate-400 hover:bg-gray-100"
                }`
              }
            >
              <House />
              <span>Dashboard</span>
              <span>
                <i className="pi pi-angle-down text-[#a5a8ae] text-xs"></i>
              </span>
            </NavLink>
          </div>

          {/* Projects Section */}
          <div
            className={`block py-2 pb-[.15rem] rounded-lg transition-all duration-300 ease-out ${
              sectionsOpen.projects ? "hover:bg-slate-50" : ""
            }`}
          >
            <div
              className="text-[#a5a8ae] px-4 py-[.65rem] cursor-pointer flex place-content-around"
              onClick={() => toggleSection("projects")}
            >
              <FolderKanban />
              <span className="text-md font-normal uppercase dark:text-neutral-500/80 text-secondary-dark">
                Projects
              </span>
              <span>
                {sectionsOpen.projects ? (
                  <i className="pi pi-angle-up text-[#a5a8ae] text-xs"></i>
                ) : (
                  <i className="pi pi-angle-down text-[#a5a8ae] text-xs"></i>
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
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                Projects List
              </NavLink>
            </div>
          </div>

          {/* expenses Section */}
          <div
            className={`block py-2 pb-[.15rem] rounded-lg transition-all duration-300 ease-out ${
              sectionsOpen.expenses ? "hover:bg-slate-50" : ""
            }`}
          >
            <div
              className="text-[#a5a8ae] px-4 py-[.65rem] cursor-pointer flex place-content-around"
              onClick={() => toggleSection("expenses")}
            >
              <AlignEndVertical />
              <span className="text-md font-normal uppercase dark:text-neutral-500/80 text-secondary-dark">
                Expenses
              </span>
              <span>
                {sectionsOpen.expenses ? (
                  <i className="pi pi-angle-up text-[#a5a8ae] text-xs"></i>
                ) : (
                  <i className="pi pi-angle-down text-[#a5a8ae] text-xs"></i>
                )}
              </span>
            </div>
            <div
              className={`section-content rounded-lg ${
                sectionsOpen.expenses ? "open" : ""
              }`}
            >
              <NavLink
                to="/expenses/company"
                className={({ isActive }) =>
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                Company Expenses
              </NavLink>
              <NavLink
                to="/expenses/lafarge"
                className={({ isActive }) =>
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                Lafarge Expenses
              </NavLink>
              <NavLink
                to="/expenses/ppe"
                className={({ isActive }) =>
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                PPE
              </NavLink>
              <NavLink
                to="/expenses/sd"
                className={({ isActive }) =>
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                SD
              </NavLink>
            </div>
          </div>

          <div
            className={`block py-2 pb-[.15rem] rounded-lg transition-all duration-300 ease-out ${
              sectionsOpen.contractor ? "hover:bg-slate-50" : ""
            }`}
          >
            <div
              className="text-[#a5a8ae] px-4 py-[.65rem] cursor-pointer flex place-content-around"
              onClick={() => toggleSection("contractor")}
            >
              <UsersRound />
              <span className="text-md font-normal uppercase dark:text-neutral-500/80 text-secondary-dark">
                Contract
              </span>
              <span>
                {sectionsOpen.contractor ? (
                  <i className="pi pi-angle-up text-[#a5a8ae] text-xs"></i>
                ) : (
                  <i className="pi pi-angle-down text-[#a5a8ae] text-xs"></i>
                )}
              </span>
            </div>
            <div
              className={`section-content ${
                sectionsOpen.contractor ? "open" : ""
              }`}
            >
              <NavLink
                to="/summary"
                className={({ isActive }) =>
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                Summary
              </NavLink>
            </div>
            <div
              className={`section-content ${
                sectionsOpen.contractor ? "open" : ""
              }`}
            >
              <NavLink
                to="/employee_company"
                className={({ isActive }) =>
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                employee company
              </NavLink>
            </div>
            <div
              className={`section-content ${
                sectionsOpen.contractor ? "open" : ""
              }`}
            >
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                Admin
              </NavLink>
            </div>
            <div
              className={`section-content ${
                sectionsOpen.contractor ? "open" : ""
              }`}
            >
              <NavLink
                to="/mec"
                className={({ isActive }) =>
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                MEC
              </NavLink>
            </div>
            <div
              className={`section-content ${
                sectionsOpen.contractor ? "open" : ""
              }`}
            >
              <NavLink
                to="/supply_chain"
                className={({ isActive }) =>
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                Supply Chain
              </NavLink>
            </div>
          </div>
          <div
            className={`block py-2 pb-[.15rem] rounded-lg transition-all duration-200 ease-out ${
              sectionsOpen.accounting ? "hover:bg-slate-50" : ""
            }`}
          >
            <div
              className="text-[#a5a8ae] px-4 py-[.65rem] cursor-pointer flex place-content-around"
              onClick={() => toggleSection("accounting")}
            >
              <WalletMinimal />
              <span className="text-md font-normal uppercase dark:text-neutral-500/80 text-secondary-dark">
                Account
              </span>
              <span>
                {sectionsOpen.accounting ? (
                  <i className="pi pi-angle-up text-[#a5a8ae] text-xs"></i>
                ) : (
                  <i className="pi pi-angle-down text-[#a5a8ae] text-xs"></i>
                )}
              </span>
            </div>
            <div
              className={`section-content ${
                sectionsOpen.accounting ? "open" : ""
              }`}
            >
              <NavLink
                to="/po"
                className={({ isActive }) =>
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                PO
              </NavLink>
            </div>
            <div
              className={`section-content ${
                sectionsOpen.accounting ? "open" : ""
              }`}
            >
              <NavLink
                to="/swift"
                className={({ isActive }) =>
                  `navLink rounded-lg text-sm font-light ${
                    isActive
                      ? "bg-main text-slate-50"
                      : "text-slate-400 hover:bg-gray-100"
                  }`
                }
              >
                Swift
              </NavLink>
            </div>
          </div>
          <div className="mt-6 px-4">
            <button
              className="w-24 px-2 py-3 rounded-lg text-main hover:bg-main hover:text-white flex items-center place-content-evenly"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              <span>Log out</span>
            </button>
          </div>
        </div>
        {/* </div> */}
      </aside>
    </>
  );
}
