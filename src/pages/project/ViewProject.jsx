import { useEffect, useState } from "react";
import GetProject from "../../API/project/GetProject";
import GetTotals from "../../API/project/GetTotals";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function View() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const projectData = await GetProject(id, setLoading, navigate); // Await GetProject promise
        const totalsData = await GetTotals(id, setLoading, navigate); // Await GetTotals promise
        setProject(projectData); // Set project data in state
        setTotals(totalsData); // Set totals data in state
      } catch (error) {
        // toast.error("Failed to fetch project."); // Display specific error message using toast
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);
  return (
    <div className="w-full p-10">
      <h1 className="text-gray-700 mb-3 text-3xl">{project?.name}</h1>
      <p className="text-gray-500 mb-5">{project?.body}</p>
      <div className="flex flex-wrap w-60 -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <p className="text-gray-700">PO: {project?.po}</p>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <p className="text-gray-700">PR: {project?.pr}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 -mx-3 mb-6">
        <div className="px-3 pr-0 border border-gray-800">
          <p className="text-gray-700 flex items-center justify-between">
            Total Project Cost:{" "}
            <span className="bg-[#FBBC04] p-2">
              {Number(totals?.total_project_cost).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="px-3 pr-0 border border-gray-800">
          <p className="text-gray-700 flex items-center justify-between">
            Budget:{" "}
            <span className="bg-[#990000] p-2 text-white">
              {Number(project?.budget).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="px-3 pr-0 border border-gray-800">
          <p className="text-gray-700 flex items-center justify-between">
            Profit:{" "}
            <span className="bg-[#1A5529] p-2 text-white">
              {(project?.budget - totals?.total_project_cost).toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      <ul className="flex flex-wrap w-48 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <NavLink
            to={`/projects/${id}/items`}
            className={({ isActive }) =>
              isActive ? "tab text-blue-600 bg-slate-100" : "tab"
            }
          >
            Items
          </NavLink>
        </li>
        <li className="me-2">
          <NavLink
            to={`/projects/${id}/workers`}
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
