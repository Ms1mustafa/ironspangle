import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import AuthCheck from "../../API/account/AuthCheck";
import SweetAlert from "../../components/SweetAlert";
import Delete from "../../API/project/Delete";
import GetTotals from "../../API/project/GetTotals"; // Make sure to import your GetTotals function

export default function ProjectsList() {
  const user = AuthCheck();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));

  async function getProjects() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/project/list.php?date=${date}`
      );
      const projectsData = response.data;

      // Fetch totals for each project
      const projectsWithTotals = await Promise.all(
        projectsData.map(async (project) => {
          const totals = await GetTotals(project.id, setLoading);
          return {
            ...project,
            total_project_cost: totals.total_project_cost,
            profit: project.budget - totals.total_project_cost,
          };
        })
      );

      setProjects(projectsWithTotals);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getProjects();
  }, [date]);

  const refreshProjects = () => {
    getProjects(); // Function to refresh projects list
  };

  const actionTemplate = (projects) => {
    return (
      <div className="flex gap-2">
        <Menu as="div" className="absolute place-self-center">
          <div>
            <MenuButton className="flex items-center space-x-2 rounded-full focus:outline-none">
              <span className="hidden sm:inline ml-2 text-lg font-bold">
                ...
              </span>
            </MenuButton>
          </div>
          <MenuItems
            transition
            className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <MenuItem>
              <NavLink
                to={`/projects/${projects.id}/items`}
                className="menuItem-link"
              >
                View
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink
                to={`/projects/${projects.id}/edit`}
                className="menuItem-link"
                disabled={user?.data.role !== "admin"}
              >
                Edit
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink
                className="menuItem-link"
                onClick={() =>
                  SweetAlert({
                    props: {
                      title:
                        "By deleting this project, all associated items, workers will also be deleted. Are you sure?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Delete",
                      onConfirm: () => {
                        Delete(projects.id, setLoading, refreshProjects);
                      },
                    },
                  })
                }
                disabled={user?.data.role !== "admin"}
              >
                Delete
              </NavLink>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    );
  };

  return (
    <div className="w-full p-8 flex flex-col">
      <div className="place-content-between flex flex-wrap gap-4">
        <input
          type="month"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input bg-white w-fit mb-4 self-start"
        />
        <NavLink
          to={user?.data.role !== "admin" ? "" : "/projects/create"}
          className="button mb-4 self-end"
        >
          Create Project
        </NavLink>
      </div>
      <div className="card">
        <DataTable
          value={projects}
          paginator
          rows={5}
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No projects found."
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column field="name" header="Name"></Column>
          <Column
            header="Total Project Cost"
            body={(data) => data.total_project_cost.toLocaleString()}
          ></Column>
          <Column
            header="Budget"
            body={(data) => data.budget.toLocaleString()}
          ></Column>
          <Column
            header="Profit"
            body={(data) => data.profit.toLocaleString()}
          ></Column>
          <Column
            header="Created at"
            body={(data) =>
              new Date(data.created_at).toLocaleDateString("en-US")
            }
          ></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
