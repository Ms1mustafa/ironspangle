import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/swift/invoice/Delete";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function SwiftInvoiceList() {
  const user = AuthCheck();
  const { id } = useParams();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getInvoices();
  }, []);

  const getInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/invoice/list.php?swift_id=${id}`
      );
      setInvoices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices.");
      setLoading(false);
    }
  };

  const refreshInvoices = () => {
    getInvoices();
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <NavLink
          to={`/swift/${id}/invoice/${rowData.id}/edit`}
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
      await Delete(workerId, setLoading, refreshInvoices);
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast.error("Failed to delete worker.");
    }
  };

  const footerGroup = invoices.length > 0 && (
    <ColumnGroup>
      <Row>
        {/* <Column
          colSpan={3}
          footerStyle={{
            backgroundColor: "#fff",
          }}
        />
        <Column
          footer={calculateOverallTotalActiveDays}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "yellow",
            color: "#000",
            fontWeight: "bold",
          }}
        />
        <Column
          colSpan={2}
          footerStyle={{
            backgroundColor: "#fff",
          }}
        /> */}
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="w-full py-8 flex flex-col">
      <NavLink
        to={`/swift/${id}/invoice/create`}
        className="button mb-4 self-end"
        disabled={user?.data.role !== "mec"}
      >
        Create Invoice
      </NavLink>
      <div className="card">
        <DataTable
          value={invoices}
          paginator
          rows={5}
          showGridlines
          footerColumnGroup={footerGroup}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No invoices found."
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loading}
          tableStyle={{ minWidth: "50rem", fontSize: "14px" }}
        >
          <Column
            field="description"
            header="Description"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />
          <Column
            field="pr_no"
            header="PR No"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />
          <Column
            field="pr_date"
            header="PR Date"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />
          <Column
            field="invoice_no"
            header="Invoice No"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            field="invoice_date"
            header="Invoice Date"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            header="Invoice Send"
            body={(rowData) =>
              Number(rowData.invoice_send) ? "True" : "False"
            }
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            header="Invoice Store"
            body={(rowData) =>
              Number(rowData.invoice_store) ? "True" : "False"
            }
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            header="Invoice PRU"
            body={(rowData) => (Number(rowData.invoice_pru) ? "True" : "False")}
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            header="Invoice Accounting"
            body={(rowData) =>
              Number(rowData.invoice_accounting) ? "True" : "False"
            }
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            field="s_no"
            header="S No"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            field="s_date"
            header="S Date"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            field="cost"
            header="Cost"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            field="p_and_lc"
            header="P & LC"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            field="guarantee"
            header="Guarantee"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            field="tax"
            header="Tax"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            field="publish"
            header="Publish"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column
            field="fines"
            header="Fines"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />

          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
}
