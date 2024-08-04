import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/expenses/sd/Delete";

export default function SDsList() {
  const user = AuthCheck();

  const [SDs, setSDs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getSDs() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/expense/sd/list.php`
      );
      setSDs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching SDs:", error);
      toast.error("Failed to fetch SDs.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getSDs();
  }, []);

  const refreshSDs = () => {
    getSDs(); // Function to refresh SDs list
  };

  const actionTemplate = (SDs) => {
    return (
      <div className="flex gap-2">
        <NavLink to={`/expenses/sd/${SDs.id}/workers`} className="button">
          View
        </NavLink>
        <NavLink to={`/expenses/sd/${SDs.id}/edit`} className="button">
          Edit
        </NavLink>
        <Button
          to={`/expenses/sd`}
          className="button bg-red-500 hover:bg-red-600"
          onClick={() =>
            SweetAlert({
              props: {
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                onConfirm: () => {
                  Delete(SDs.id, setLoading, refreshSDs);
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
        to="/expenses/sd/create"
        className="button mb-4 self-end"
        disabled={user?.data.role !== "admin"}
      >
        Create SD
      </NavLink>
      <div className="card">
        <DataTable
          value={SDs}
          paginator
          rows={5}
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No SDs found."
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column field="name" header="Name"></Column>
          <Column field="budget" header="Budget"></Column>
          <Column field="po" header="PO"></Column>
          <Column field="pr" header="PR"></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
