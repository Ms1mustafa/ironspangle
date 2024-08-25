import { useEffect, useState } from "react";
import GetSD from "../../../API/expenses/sd/GetSD";
import GetTotals from "../../../API/expenses/sd/GetTotals";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import {
  Banknote,
  Building2,
  CircleDollarSign,
  Receipt,
  ReceiptText,
} from "lucide-react";

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
        <div className="count-card">
          <div className="count-card-inner">
            <Banknote size={55} className="count-card-icon bg-[#f54f5f]" />
            <div className="count-card-info">
              <p>PO cost</p>
              <span>{Number(SD?.budget).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <ReceiptText size={55} className="count-card-icon bg-[#67cadf]" />
            <div className="count-card-info">
              <p>ISG</p>
              <span>{Number(SD?.isg).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <CircleDollarSign
              size={55}
              className="count-card-icon bg-[#27d095]"
            />
            <div className="count-card-info">
              <p>Profit</p>
              <span>
                {(SD?.budget - totals?.total_sd_cost).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <Receipt size={55} className="count-card-icon bg-[#4f65f5]" />
            <div className="count-card-info">
              <p>Total SD Cost</p>
              <span>{Number(totals?.total_sd_cost).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <Building2 size={55} className="count-card-icon bg-[#ffbc56]" />
            <div className="count-card-info">
              <p>Lafarge</p>
              <span>{Number(SD?.po - SD?.isg).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <ul className="flex flex-wrap w-48 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <NavLink
            to={`/expenses/sd/${id}/workers`}
            className={({ isActive }) =>
              isActive ? "tab text-main bg-main bg-opacity-10" : "tab"
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
