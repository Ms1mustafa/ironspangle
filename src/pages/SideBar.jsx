import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "primeicons/primeicons.css";
import {
  AlignEndVertical,
  FolderKanban,
  House,
  LogOut,
  Users,
  UsersRound,
  WalletMinimal,
} from "lucide-react";
import sidebarItems from "./data/sidebarItems.json"; // Adjust the path as necessary

const iconMap = {
  House: <House />,
  FolderKanban: <FolderKanban />,
  AlignEndVertical: <AlignEndVertical />,
  UsersRound: <UsersRound />,
  WalletMinimal: <WalletMinimal />,
  Users: <Users />,
};

export default function SideBar({ logo }) {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  // State to manage section visibility
  const [sectionsOpen, setSectionsOpen] = useState({});

  // Function to toggle section visibility
  const toggleSection = (section) => {
    setSectionsOpen((prevSectionsOpen) => ({
      ...prevSectionsOpen,
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
          {sidebarItems.map((item) => (
            <div
              key={item.section}
              className={`block py-2 pb-[.15rem] rounded-lg transition-all duration-300 ease-out ${
                sectionsOpen[item.section] ? "hover:bg-slate-50" : ""
              }`}
            >
              <div
                className="text-[#a5a8ae] px-4 py-[.65rem] cursor-pointer flex place-content-around"
                onClick={() => toggleSection(item.section)}
              >
                {iconMap[item.icon] || <span>Icon</span>}
                <span className="text-md font-normal uppercase dark:text-neutral-500/80 text-secondary-dark">
                  {item.title}
                </span>
                <span>
                  {sectionsOpen[item.section] ? (
                    <i className="pi pi-angle-up text-[#a5a8ae] text-xs"></i>
                  ) : (
                    <i className="pi pi-angle-down text-[#a5a8ae] text-xs"></i>
                  )}
                </span>
              </div>
              {item.subItems.length > 0 && (
                <div
                  className={`section-content ${
                    sectionsOpen[item.section] ? "open" : ""
                  }`}
                >
                  {item.subItems.map((subItem) => (
                    <NavLink
                      key={subItem.title}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `navLink rounded-lg text-sm font-light ${
                          isActive
                            ? "bg-main text-slate-50"
                            : "text-slate-400 hover:bg-gray-100"
                        }`
                      }
                    >
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
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
      </aside>
    </>
  );
}
