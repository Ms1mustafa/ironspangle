import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../API/account/AuthCheck";
import Button from "../../components/Button";
import SweetAlert from "../../components/SweetAlert";
import Delete from "../../API/po/Delete";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function POList() {
  const user = AuthCheck();

  const [po, setPO] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getPO() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/po/list.php`
      );
      setPO(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching PO:", error);
      toast.error("Failed to fetch PO.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getPO();
  }, []);

  const refreshPO = () => {
    getPO(); // Function to refresh po list
  };

  const actionTemplate = (po) => {
    return (
      <div className="flex gap-2">
        <NavLink to={`/po/${po.id}/edit`} className="button">
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
                  Delete(po.id, setLoading, refreshPO);
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
    return po
      .reduce((total, po) => {
        const { price } = po;
        return total + Number(price);
      }, 0)
      .toLocaleString();
  };

  const footerGroup = po.length > 0 && (
    <ColumnGroup>
      <Row>
        <Column
          colSpan={4}
          footerStyle={{
            backgroundColor: "#fff",
          }}
        />
        <Column
          footer={calculateOverallTotalPriceTotal}
          footerStyle={{
            backgroundColor: "yellow",
          }}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="w-full p-8 flex flex-col">
      <NavLink
        to="/po/create"
        className="button mb-4 self-end"
        disabled={user?.data.role !== "admin"}
      >
        Create PO
      </NavLink>
      <div className="card">
        <DataTable
          value={po}
          paginator
          rows={5}
          showGridlines
          footerColumnGroup={footerGroup}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No PO found."
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column field="description" header="Description"></Column>
          <Column field="no_pr" header="No PR"></Column>
          <Column field="no_po" header="No PO"></Column>
          <Column field="status" header="Status"></Column>
          <Column
            field="price"
            body={({ price }) => Number(price).toLocaleString()}
          ></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
