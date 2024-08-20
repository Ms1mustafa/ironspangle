import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../API/account/AuthCheck";
import Button from "../../components/Button";
import SweetAlert from "../../components/SweetAlert";
import Delete from "../../API/swift/Delete";

export default function SwiftList() {
  const user = AuthCheck();

  const [swift, setSwift] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getSwift() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/swift/list.php`
      );
      setSwift(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching swift:", error);
      toast.error("Failed to fetch swift.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getSwift();
  }, []);

  const refreshSwift = () => {
    getSwift(); // Function to refresh po list
  };

  const actionTemplate = (swift) => {
    return (
      <div className="flex gap-2">
        <NavLink to={`/swift/${swift.id}/invoice`} className="button">
          View
        </NavLink>
        <NavLink to={`/swift/${swift.id}/edit`} className="button">
          Edit
        </NavLink>
        <Button
          className="button bg-red-500 hover:bg-red-600"
          onClick={() =>
            SweetAlert({
              props: {
                title:
                  "By deleting this Swift, all associated invoices will also be deleted. Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                onConfirm: () => {
                  Delete(swift.id, setLoading, refreshSwift);
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

  const calculateOverallTotalPriceTotal = () => {
    return swift
      .reduce((total, swift) => {
        const { price } = swift;
        return total + Number(price);
      }, 0)
      .toLocaleString();
  };

  return (
    <div className="w-full p-8 flex flex-col">
      <NavLink
        to="/swift/create"
        className="button mb-4 self-end"
        disabled={user?.data.role !== "admin"}
      >
        Create swift
      </NavLink>
      <div className="card">
        <DataTable
          value={swift}
          paginator
          rows={5}
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No swift found."
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column field="swift" header="Swift"></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
