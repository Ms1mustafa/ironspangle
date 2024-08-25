import { useEffect, useState } from "react";
import GetAdmin from "../../API/admin/GetAdmin";
import GetTotals from "../../API/admin/GetTotals";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Banknote,
  CalendarClock,
  CalendarCog,
  Car,
  HandCoins,
  Layers3,
} from "lucide-react";

export default function View() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [totals, setTotals] = useState(null);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adminData = await GetAdmin(id, setLoading, navigate); // Await GetAdmin promise
        const totalsData = await GetTotals(id, setLoading, navigate); // Await GetTotals promise
        setAdmin(adminData); // Set admin data in state
        setTotals(totalsData); // Set totals data in state
      } catch (error) {
        // toast.error("Failed to fetch admin."); // Display specific error message using toast
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
            PO: {Number(admin?.po).toLocaleString()}
          </p>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <p className="text-gray-700">
            PR: {Number(admin?.pr).toLocaleString()}
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
            <CalendarClock size={55} className="count-card-icon bg-[#ffbc56]" />
            <div className="count-card-info">
              <p>Working days</p>
              <span>{Number(totals?.working_days).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <CalendarCog size={55} className="count-card-icon bg-[#31c19f]" />
            <div className="count-card-info">
              <p>PR days</p>
              <span>{Number(totals?.pr_days).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <ul className="flex flex-wrap w-48 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <NavLink
            to={`/admin/${id}/workers`}
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
