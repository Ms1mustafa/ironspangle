import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../API/account/AuthCheck";
import Button from "../../components/Button";
import SweetAlert from "../../components/SweetAlert";
import Delete from "../../API/project/Delete";

export default function ProjectsList() {
  const user = AuthCheck();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getProjects() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/project/list.php`
      );
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  const refreshProjects = () => {
    getProjects(); // Function to refresh projects list
  };

  const actionTemplate = (projects) => {
    return (
      <div className="flex gap-2">
        <NavLink to={`/projects/${projects.id}/items`} className="button">
          View
        </NavLink>
        <NavLink to={`/projects/${projects.id}/edit`} className="button">
          Edit
        </NavLink>
        <Button
          to={`/projects/${projects.id}/items`}
          className="button bg-red-500 hover:bg-red-600"
          onClick={() =>
            SweetAlert({
              props: {
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                onConfirm: () => {
                  Delete(projects.id, setLoading, refreshProjects);
                },
              },
            })
          }
        >
          Delete
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full p-8 flex flex-col">
      <NavLink
        to="/projects/create"
        className="button mb-4 self-end"
        disabled={user?.data.role !== "admin"}
      >
        Create Project
      </NavLink>
      <div className="card">
        <DataTable
          value={projects}
          paginator
          rows={5}
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No projects found."
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column field="name" header="Name"></Column>
          <Column field="created_at" header="Created at"></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
