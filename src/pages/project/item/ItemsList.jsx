import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/project/item/Delete";

export default function ItemsList() {
  const user = AuthCheck();

  const [Items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    getItems();
  }, []);

  const refreshItems = () => {
    getItems();
  };

  async function getItems() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/project/item/list.php?project_id=${id}`
      );
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Items:", error);
      toast.error("Failed to fetch Items.");
      setLoading(false);
    }
  }

  const actionTemplate = (Items) => {
    return (
      <div className="flex gap-2">
        <NavLink
          to={`/projects/${id}/items/${Items.id}/edit`}
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

  const total_price = function (Items) {
    return Items.qty * Items.unit_price;
  };

  const total_cost = function (Items) {
    return Items.qty * Items.unit_price + Items.trans;
  };

  return (
    <div className="w-full py-8 px-4 flex flex-col">
      <NavLink
        to={`/projects/${id}/items/create`}
        className="button mb-4 self-end"
        disabled={user?.data.role !== "admin"}
      >
        Create Item
      </NavLink>
      <div className="card">
        <DataTable
          value={Items}
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
            style={{ width: "10%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            field="unit"
            header="Unit"
            sortable
            style={{ width: "10%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            field="qty"
            header="QTY"
            sortable
            style={{ width: "10%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            field="unit_price"
            header="Unit Price"
            sortable
            style={{ width: "10%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            header="Total Price"
            body={total_price}
            sortable
            style={{ width: "10%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            field="trans"
            header="Trans"
            sortable
            style={{ width: "10%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            header="Total Cost"
            body={total_cost}
            sortable
            style={{ width: "10%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            field="date"
            header="Date"
            sortable
            style={{ width: "10%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            field="remarks"
            header="Remarks"
            sortable
            style={{ width: "10%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            header="Actions"
            body={actionTemplate}
            style={{ width: "10%", borderBottom: "1px solid #dee2e6" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
