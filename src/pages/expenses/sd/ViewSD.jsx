import { useEffect, useState } from "react";
import GetSD from "../../../API/expenses/sd/GetSD";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

export default function View() {
  const { id } = useParams();
  const [SD, setSD] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const SDData = await GetSD(id, setLoading, navigate); // Await GetSD promise
        setSD(SDData); // Set SD data in state
      } catch (error) {
        // toast.error("Failed to fetch SD."); // Display specific error message using toast
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);
  return (
    <div className="w-full p-10">
      <h1 className="text-gray-700 mb-3 text-3xl">{SD?.name}</h1>
      <p className="text-gray-700 mb-5">Budget: {SD?.budget}</p>
      <div className="flex flex-wrap w-60 -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <p className="text-gray-700">PO: {SD?.po}</p>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <p className="text-gray-700">PR: {SD?.pr}</p>
        </div>
      </div>

      <ul className="flex flex-wrap w-48 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <NavLink
            to={`/expenses/sd/${id}/workers`}
            className={({ isActive }) =>
              isActive ? "tab text-blue-600 bg-slate-100" : "tab"
            }
          >
            Workers
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
