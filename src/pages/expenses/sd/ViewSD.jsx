import { useEffect, useState } from "react";
import GetSD from "../../../API/expenses/sd/GetSD";
import GetTotals from "../../../API/expenses/sd/GetTotals";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

export default function ViewSD() {
  const { id } = useParams();
  const [SD, setSD] = useState(null);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const SDData = await GetSD(id, setLoading, navigate); // Await GetSD promise
        const totalsData = await GetTotals(id, setLoading, navigate);

        setSD(SDData); // Set SD data in state
        setTotals(totalsData);
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
      <div className="flex flex-wrap w-60 -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <p className="text-gray-700">PO: {SD?.po}</p>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <p className="text-gray-700">PR: {SD?.pr}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 -mx-3 mb-6">
        <div className="px-3 pr-0 border border-gray-800">
          <p className="text-gray-700 flex items-center justify-between">
            PO cost:{" "}
            <span className="bg-[#990000] p-2 text-white">
              {Number(SD?.budget).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="px-3 pr-0 border border-gray-800">
          <p className="text-gray-700 flex items-center justify-between">
            ISG:{" "}
            <span className="bg-[#262b27] p-2 text-white">
              {Number(SD?.isg).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="px-3 pr-0 border border-gray-800">
          <p className="text-gray-700 flex items-center justify-between">
            Profit:{" "}
            <span className="bg-[#1A5529] p-2 text-white">
              {(SD?.budget - totals?.total_sd_cost).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="px-3 pr-0 border border-gray-800">
          <p className="text-gray-700 flex items-center justify-between">
            Total SD Cost:{" "}
            <span className="bg-[#FBBC04] p-2">
              {Number(totals?.total_sd_cost).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="px-3 pr-0 border border-gray-800">
          <p className="text-gray-700 flex items-center justify-between">
            Lafarge:{" "}
            <span className="bg-[#1A5529] p-2 text-white">
              {Number(SD?.po - SD?.isg).toLocaleString()}
            </span>
          </p>
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
