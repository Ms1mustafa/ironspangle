import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../API/account/AuthCheck";
import Button from "../../components/Button";
import SweetAlert from "../../components/SweetAlert";
import Delete from "../../API/mec/Delete";

export default function MecList() {
  const user = AuthCheck();

  const [mec, setMec] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));

  async function getMec() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/mec/list.php?date=${date}`
      );
      setMec(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching MEC:", error);
      toast.error("Failed to fetch MEC.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getMec();
  }, [date]);

  const refreshMec = () => {
    getMec(); // Function to refresh mec list
  };

  const actionTemplate = (mec) => {
    return (
      <div className="flex gap-2">
        <NavLink to={`/mec/${mec.id}/workers`} className="button">
          View
        </NavLink>
        <NavLink to={`/mec/${mec.id}/edit`} className="button">
          Edit
        </NavLink>
        <Button
          to={`/mec/${mec.id}/items`}
          className="button bg-red-500 hover:bg-red-600"
          onClick={() =>
            SweetAlert({
              props: {
                title:
                  "By deleting this MEC, all associated workers will also be deleted. Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                onConfirm: () => {
                  Delete(mec.id, setLoading, refreshMec);
                },
              },
            })
          }
        >
          Delete
        </Button>
        <NavLink to={`/mec/${mec.id}/copy`} className="button">
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
          to="/mec/create"
          className="button mb-4 self-end"
          disabled={user?.data.role !== "mec"}
        >
          Create MEC
        </NavLink>
      </div>
      <div className="card">
        <DataTable
          value={mec}
          showGridlines
          emptyMessage="No mec found."
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column
            header="Fixed Invoice Cost"
            body={(rowData) =>
              rowData?.fixed_invoice_cost
                ? Number(rowData.fixed_invoice_cost).toLocaleString()
                : ""
            }
          ></Column>
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
