import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../API/account/AuthCheck";
import Button from "../../components/Button";
import SweetAlert from "../../components/SweetAlert";
import Delete from "../../API/supply_chain/Delete";

export default function Supply_chainList() {
  const user = AuthCheck();

  const [supply_chain, setSupply_chain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));

  async function getSupply_chain() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/supply_chain/list.php?date=${date}`
      );
      setSupply_chain(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Supply chain:", error);
      toast.error("Failed to fetch Supply chain.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getSupply_chain();
  }, [date]);

  const refreshSupply_chain = () => {
    getSupply_chain(); // Function to refresh supply_chain list
  };

  const actionTemplate = (supply_chain) => {
    return (
      <div className="flex gap-2">
        <NavLink
          to={`/supply_chain/${supply_chain.id}/workers`}
          className="button"
        >
          View
        </NavLink>
        <NavLink
          to={`/supply_chain/${supply_chain.id}/edit`}
          className="button"
        >
          Edit
        </NavLink>
        <Button
          to={`/supply_chain/${supply_chain.id}/workers`}
          className="button bg-red-500 hover:bg-red-600"
          onClick={() =>
            SweetAlert({
              props: {
                title:
                  "By deleting this Supply Chain, all associated workers will also be deleted. Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                onConfirm: () => {
                  Delete(supply_chain.id, setLoading, refreshSupply_chain);
                },
              },
            })
          }
        >
          Delete
        </Button>
        <NavLink
          to={`/supply_chain/${supply_chain.id}/copy`}
          className="button"
        >
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
          to="/supply_chain/create"
          className="button mb-4 self-end"
          disabled={user?.data.role !== "supply_chain"}
        >
          Create Supply Chain
        </NavLink>
      </div>
      <div className="card">
        <DataTable
          value={supply_chain}
          showGridlines
          emptyMessage="No supply_chain found."
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column header="PO" field="po"></Column>
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
