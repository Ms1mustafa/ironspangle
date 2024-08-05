import { useEffect, useState } from "react";
import GetSupply_chain from "../../API/supply_chain/GetSupply_chain";
import GetTotals from "../../API/supply_chain/GetTotals";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

export default function View() {
  const { id } = useParams();
  const [supply_chain, setSupply_chain] = useState(null);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supply_chainData = await GetSupply_chain(
          id,
          setLoading,
          navigate
        ); // Await GetSupply_chain promise
        const totalsData = await GetTotals(id, setLoading, navigate); // Await GetTotals promise
        setSupply_chain(supply_chainData); // Set supply_chain data in state
        setTotals(totalsData); // Set totals data in state
      } catch (error) {
        // toast.error("Failed to fetch supply_chain."); // Display specific error message using toast
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);
  return (
    <div className="w-full p-10">
      <div className="flex flex-wrap w-72 -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <p className="text-gray-700">
            PO: {Number(supply_chain?.po).toLocaleString()}
          </p>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <p className="text-gray-700">
            PR: {Number(supply_chain?.pr).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 -mx-3 mb-6">
        <div className="bg-white text-black px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Total contract salary{" "}
            <span className="p-2 bg-[#00427f] text-white font-bold">
              {Number(totals?.total_contract_salary).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="bg-white text-black px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Total labor salary{" "}
            <span className="p-2 bg-[#00427f] text-white font-bold">
              {Number(totals?.total_labor_salary).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="bg-white text-black px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Transportation{" "}
            <span className="p-2 bg-[#00427f] text-white font-bold">
              {Number(totals?.transportation).toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 -mx-3 mb-6">
        <div className="bg-white text-black px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Insurance{" "}
            <span className="p-2 bg-[#00427f] text-white font-bold">
              {Number(totals?.insurance).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="bg-white text-black px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            PPEs{" "}
            <span className="p-2 bg-[#00427f] text-white font-bold">
              {Number(totals?.ppe).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="bg-white text-black px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Working days{" "}
            <span className="p-2 bg-[#00427f] text-white font-bold">
              {Number(totals?.working_days).toLocaleString()}
            </span>
          </p>
        </div>
      </div>
      <ul className="flex flex-wrap w-48 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <NavLink
            to={`/supply_chain/${id}/workers`}
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
