import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/project/worker/Delete";

export default function WorkersList() {
  const user = AuthCheck();

  const [Workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    getWorkers();
  }, []);

  const refreshItems = () => {
    getWorkers();
  };

  async function getWorkers() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/project/worker/list.php?project_id=${id}`
      );
      setWorkers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching workers:", error);
      toast.error("Failed to fetch workers.");
      setLoading(false);
    }
  }

  const actionTemplate = (Items) => {
    return (
      <div className="flex gap-2">
        <NavLink
          to={`/projects/${id}/workers/${Items.id}/edit`}
          className="button"
        >
          Edit
        </NavLink>
        <Button
          to={`/projects/${id}/items`}
          className="button bg-red-500 hover:bg-red-600"
          onClick={() =>
            SweetAlert({
              props: {
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                onConfirm: () => {
                  Delete(Items.id, setLoading, refreshItems);
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
    <div className="w-full py-8 px-4 flex flex-col">
      <NavLink
        to={`/projects/${id}/workers/create`}
        className="button mb-4 self-end"
        disabled={user?.data.role !== "admin"}
      >
        Create Worker
      </NavLink>
      <div className="card">
        <DataTable
          value={Workers}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No Items found."
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
            borderCollapse: "separate",
            // borderSpacing: "0 10px",
            height: "20rem",
          }}
        >
          <Column
            field="name"
            header="Name"
            sortable
            style={{ width: "25%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            field="created_at"
            header="Created at"
            sortable
            style={{ width: "25%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            header="Actions"
            body={actionTemplate}
            style={{ width: "25%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
