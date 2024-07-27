import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../API/account/AuthCheck";
import Button from "../../components/Button";
import SweetAlert from "../../components/SweetAlert";
import Delete from "../../API/admin/Delete";

export default function AdminList() {
  const user = AuthCheck();

  const [admin, setAdmin] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));

  async function getAdmin() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/admin/list.php?date=${date}`
      );
      setAdmin(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin:", error);
      toast.error("Failed to fetch admin.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getAdmin();
  }, [date]);

  const refreshadmin = () => {
    getAdmin(); // Function to refresh admin list
  };

  const actionTemplate = (admin) => {
    return (
      <div className="flex gap-2">
        <NavLink to={`/admin/${admin.id}/workers`} className="button">
          View
        </NavLink>
        <NavLink to={`/admin/${admin.id}/edit`} className="button">
          Edit
        </NavLink>
        <Button
          to={`/admin/${admin.id}/items`}
          className="button bg-red-500 hover:bg-red-600"
          onClick={() =>
            SweetAlert({
              props: {
                title:
                  "By deleting this Admin, all associated workers will also be deleted. Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                onConfirm: () => {
                  Delete(admin.id, setLoading, refreshadmin);
                },
              },
            })
          }
        >
          Delete
        </Button>
        <NavLink to={`/admin/${admin.id}/copy`} className="button">
          Copy
        </NavLink>
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
          className="input w-fit mb-4 self-start"
        />
        <NavLink
          to="/admin/create"
          className="button mb-4 self-end"
          disabled={user?.data.role !== "admin"}
        >
          Create Admin
        </NavLink>
      </div>
      <div className="card">
        <DataTable
          value={admin}
          showGridlines
          emptyMessage="No admin found."
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column
            header="PO"
            body={(rowData) =>
              rowData?.po ? Number(rowData.po).toLocaleString() : ""
            }
          ></Column>
          <Column
            header="PR"
            body={(rowData) =>
              rowData?.pr ? Number(rowData.pr).toLocaleString() : ""
            }
          ></Column>
          <Column field="date" header="Date"></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
