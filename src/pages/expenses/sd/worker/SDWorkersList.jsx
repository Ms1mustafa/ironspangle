import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../../../API/account/AuthCheck";
import Button from "../../../../components/Button";
import SweetAlert from "../../../../components/SweetAlert";
import Delete from "../../../../API/expenses/sd/worker/Delete";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function SDWorkersList() {
  const user = AuthCheck();
  const { id } = useParams();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSDs();
  }, []);

  const getSDs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/expense/sd/worker/list.php?sd_id=${id}`
      );
      setWorkers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching workers:", error);
      toast.error("Failed to fetch workers.");
      setLoading(false);
    }
  };

  const refreshWorkers = () => {
    getSDs();
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <NavLink
          to={`/expenses/sd/${id}/workers/${rowData.id}/edit`}
          className="button"
        >
          Edit
        </NavLink>
        <Button
          className="button bg-red-500 hover:bg-red-600"
          onClick={() =>
            SweetAlert({
              props: {
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                onConfirm: () => {
                  handleDelete(rowData.id);
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

  const handleDelete = async (workerId) => {
    try {
      await Delete(workerId, setLoading, refreshWorkers);
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast.error("Failed to delete worker.");
    }
  };

  return (
    <div className="w-full py-8 px-4 flex flex-col">
      <NavLink
        to={`/expenses/sd/${id}/workers/create`}
        className="button mb-4 self-end"
        disabled={user?.data.role !== "admin"}
      >
        Create Worker
      </NavLink>
      <div className="card">
        <DataTable
          value={workers}
          paginator
          rows={5}
          showGridlines
          stripedRows
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No Workers found."
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="name" header="Name" sortable />

          <Column field="days" header="Days" sortable />
          <Column
            header="Cost / Day"
            body={(rowData) =>
              rowData?.day_cost ? Number(rowData.day_cost).toLocaleString() : ""
            }
            sortable
          />
          <Column
            header="Total Contract Salarys"
            body={(rowData) =>
              rowData?.days && rowData?.day_cost
                ? (
                    Number(rowData.days) * Number(rowData.day_cost)
                  ).toLocaleString()
                : ""
            }
            sortable
          />
          <Column
            header="Transportation"
            body={(rowData) =>
              rowData?.transportation
                ? Number(rowData.transportation).toLocaleString()
                : ""
            }
            sortable
          />
          <Column
            header="Day Salary"
            body={(rowData) =>
              rowData?.day_salary
                ? Number(rowData.day_salary).toLocaleString()
                : ""
            }
            sortable
          />
          <Column
            header="Total Salary"
            body={(rowData) =>
              rowData?.day_salary && rowData?.days
                ? Number(rowData.day_salary * rowData.days).toLocaleString()
                : ""
            }
            sortable
          />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
}
