import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/expenses/lafarge/Delete";

export default function Lafarge_expensesList() {
  const user = AuthCheck();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getExpenses() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/expense/lafarge/list.php`
      );
      setExpenses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getExpenses();
  }, []);

  const refreshExpenses = () => {
    getExpenses(); // Function to refresh projects list
  };

  const actionTemplate = (expenses) => {
    return (
      <div className="flex gap-2">
        <NavLink
          to={`/expenses/lafarge/${expenses.id}/edit`}
          className="button"
        >
          Edit
        </NavLink>
        <Button
          to={`/expenses/lafarge`}
          className="button bg-red-500 hover:bg-red-600"
          onClick={() =>
            SweetAlert({
              props: {
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                onConfirm: () => {
                  Delete(expenses.id, setLoading, refreshExpenses);
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
        to="/expenses/lafarge/create"
        className="button mb-4 self-end"
        disabled={user?.data.role !== "admin"}
      >
        Create Expense
      </NavLink>
      <div className="card">
        <DataTable
          value={expenses}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No expenses found."
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
            field="item"
            header="Item Name"
            sortable
            style={{ borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            field="cost"
            header="Cost"
            sortable
            style={{ borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            field="date"
            header="Date"
            sortable
            style={{ borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            field="remark"
            header="Remark"
            sortable
            style={{ borderBottom: "1px solid #dee2e6" }}
          ></Column>
          <Column
            header="Actions"
            body={actionTemplate}
            style={{ borderBottom: "1px solid #dee2e6" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
