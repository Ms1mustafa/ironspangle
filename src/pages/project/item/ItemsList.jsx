import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/project/item/Delete";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function ItemsList() {
  const user = AuthCheck();
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/project/item/list.php?project_id=${id}`
      );
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching Items:", error);
      toast.error("Failed to fetch Items.");
    } finally {
      setLoading(false);
    }
  };

  const refreshItems = () => {
    getItems();
  };

  const actionTemplate = (item) => (
    <div className="flex gap-2">
      <NavLink to={`/projects/${id}/items/${item.id}/edit`} className="button">
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
                Delete(item.id, setLoading, refreshItems);
              },
            },
          })
        }
      >
        Delete
      </Button>
    </div>
  );

  const total_price = (item) => (item.qty * item.unit_price).toLocaleString();
  const total_cost = (item) =>
    (item.qty * item.unit_price + item.trans).toLocaleString();

  const calculateTotalCost = () =>
    items
      .reduce(
        (total, item) => total + item.trans + item.qty * item.unit_price,
        0
      )
      .toLocaleString();

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          colSpan={6}
          footerStyle={{ backgroundColor: "#fff", textAlign: "right" }}
        />
        <Column
          footer={calculateTotalCost}
          footerStyle={{ backgroundColor: "yellow", fontWeight: "bold" }}
        />
      </Row>
    </ColumnGroup>
  );

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
          value={items}
          paginator
          rows={5}
          showGridlines
          stripedRows
          rowsPerPageOptions={[5, 10, 25, 50]}
          footerColumnGroup={footerGroup}
          emptyMessage="No Items found."
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column field="name" header="Name" sortable />
          <Column field="unit" header="Unit" sortable />
          <Column field="qty" header="QTY" sortable />
          <Column
            header="Unit Price"
            body={(rowData) =>
              rowData?.unit_price ? rowData.unit_price.toLocaleString() : ""
            }
            sortable
          />
          <Column header="Total Price" body={total_price} sortable />
          <Column
            header="Trans"
            body={(rowData) =>
              rowData?.trans ? rowData.trans.toLocaleString() : ""
            }
            sortable
          />
          <Column header="Total Cost" body={total_cost} sortable />
          <Column field="date" header="Date" sortable />
          <Column field="remarks" header="Remarks" sortable />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
}
