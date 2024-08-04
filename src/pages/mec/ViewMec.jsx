import { useEffect, useState } from "react";
import GetMec from "../../API/mec/GetMec";
import GetTotals from "../../API/mec/GetTotals";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

export default function View() {
  const { id } = useParams();
  const [mec, setMec] = useState(null);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mecData = await GetMec(id, setLoading, navigate); // Await GetMec promise
        const totalsData = await GetTotals(id, setLoading, navigate); // Await GetTotals promise
        setMec(mecData); // Set mec data in state
        setTotals(totalsData); // Set totals data in state
      } catch (error) {
        // toast.error("Failed to fetch mec."); // Display specific error message using toast
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);
  return (
    <div className="w-full p-10">
      <div className="flex flex-wrap w-64 -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <p className="text-gray-700">
            PO: {Number(mec?.po).toLocaleString()}
          </p>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <p className="text-gray-700">
            PR: {Number(mec?.pr).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 -mx-3 mb-6">
        <div className="bg-[#00427f] text-white px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Total contract salary:{" "}
            <span className="p-2">
              {Number(totals?.total_contract_salary).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="bg-[#00427f] text-white px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Total labor salary:{" "}
            <span className="p-2">
              {Number(totals?.total_labor_salary).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="bg-[#00427f] text-white px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Transportation:{" "}
            <span className="p-2">
              {Number(totals?.transportation).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="bg-[#00427f] text-white px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Insurance:{" "}
            <span className="p-2">
              {Number(totals?.insurance).toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 -mx-3 mb-6">
        <div className="bg-[#00427f] text-white px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            PPEs:{" "}
            <span className="p-2">{Number(totals?.ppe).toLocaleString()}</span>
          </p>
        </div>
        <div className="bg-[#00427f] text-white px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Fixed Invoice Cost:{" "}
            <span className="p-2">
              {Number(mec?.fixed_invoice_cost).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="bg-[#00427f] text-white px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Return to company:{" "}
            <span className="p-2">
              {(
                Number(mec?.fixed_invoice_cost) -
                Number(totals?.total_contract_salary)
              ).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="bg-[#00427f] text-white px-3 pr-0 border border-gray-800">
          <p className="flex items-center justify-between">
            Working days:{" "}
            <span className="p-2">
              {Number(totals?.working_days).toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      <ul className="flex flex-wrap w-48 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <NavLink
            to={`/mec/${id}/workers`}
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
