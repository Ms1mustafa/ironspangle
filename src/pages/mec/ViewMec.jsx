import { useEffect, useState } from "react";
import GetMec from "../../API/mec/GetMec";
import GetTotals from "../../API/mec/GetTotals";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import {
  Banknote,
  CalendarClock,
  Car,
  HandCoins,
  Layers3,
  ReceiptText,
  Undo2,
} from "lucide-react";

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
        <div className="count-card">
          <div className="count-card-inner">
            <Banknote size={55} className="count-card-icon bg-[#f54f5f]" />
            <div className="count-card-info">
              <p>Total contract salary</p>
              <span>
                {Number(totals?.total_contract_salary).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <Banknote size={55} className="count-card-icon bg-[#f54f5f]" />
            <div className="count-card-info">
              <p>Total labor salary</p>
              <span>{Number(totals?.total_labor_salary).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <Car size={55} className="count-card-icon bg-[#67cadf]" />
            <div className="count-card-info">
              <p>Transportation</p>
              <span>{Number(totals?.transportation).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <HandCoins size={55} className="count-card-icon bg-[#27d095]" />
            <div className="count-card-info">
              <p>Insurance</p>
              <span>{Number(totals?.insurance).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <Layers3 size={55} className="count-card-icon bg-[#4f65f5]" />
            <div className="count-card-info">
              <p>PPEs</p>
              <span>{Number(totals?.ppe).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <ReceiptText size={55} className="count-card-icon bg-[#ff617b]" />
            <div className="count-card-info">
              <p>Fixed Invoice Cost</p>
              <span>{Number(mec?.fixed_invoice_cost).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <Undo2 size={55} className="count-card-icon bg-[#d5e955]" />
            <div className="count-card-info">
              <p>Return to company</p>
              <span>
                {(
                  Number(mec?.fixed_invoice_cost) -
                  Number(totals?.total_contract_salary)
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <CalendarClock size={55} className="count-card-icon bg-[#ffbc56]" />
            <div className="count-card-info">
              <p>Working days</p>
              <span>{Number(totals?.working_days).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <ul className="flex flex-wrap w-48 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <NavLink
            to={`/mec/${id}/workers`}
            className={({ isActive }) =>
              isActive ? "tab text-main bg-main bg-opacity-5" : "tab"
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
