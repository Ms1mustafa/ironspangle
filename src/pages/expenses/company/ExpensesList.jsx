import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/expenses/company/Delete";

export default function Company_expensesList() {
  const user = AuthCheck();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));

  async function getExpenses() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/expense/company/list.php?date=${date}`
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
  }, [date]);

  const refreshExpenses = () => {
    getExpenses(); // Function to refresh projects list
  };

  const actionTemplate = (expenses) => {
    return (
      <div className="flex gap-2">
        <NavLink
          to={`/expenses/company/${expenses.id}/edit`}
          className="button"
        >
          Edit
        </NavLink>
        <Button
          to={`/expenses/company`}
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
      <div className="place-content-between flex flex-wrap gap-4">
        <input
          type="month"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input w-fit mb-4 self-start"
        />
        <NavLink
          to="/expenses/company/create"
          className="button mb-4 self-end"
          disabled={user?.data.role !== "admin"}
        >
          Create Expense
        </NavLink>
      </div>
      <div className="card">
        <DataTable
          value={expenses}
          paginator
          rows={5}
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No expenses found."
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column field="item" header="Item Name"></Column>
          <Column field="unit" header="Unit"></Column>
          <Column field="qty" header="QTY"></Column>
          <Column field="unit_price" header="Unit Price"></Column>
          <Column
            header="Total Price"
            body={({ unit_price, qty }) => unit_price * qty}
          ></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
