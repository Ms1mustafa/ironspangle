import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/expenses/ppe/Delete";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

export default function PPE_expensesList() {
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
        }/expense/ppe/list.php?date=${date}`
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
        <Menu as="div" className="absolute place-self-center">
          <div>
            <MenuButton className="flex items-center space-x-2 rounded-full focus:outline-none">
              <span className="hidden sm:inline ml-2 text-lg font-bold">
                ...
              </span>
            </MenuButton>
          </div>
          <MenuItems
            transition
            className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <MenuItem>
              <NavLink
                to={`/expenses/ppe/${expenses.id}/edit`}
                className="menuItem-link"
                disabled={user?.data.role !== "admin"}
              >
                Edit
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink
                className="menuItem-link"
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
                disabled={user?.data.role !== "admin"}
              >
                Delete
              </NavLink>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    );
  };

  const calculateOverallTotalPriceTotal = () => {
    return expenses
      .reduce((total, expenses) => {
        const { unit_price, qty } = expenses;
        return total + Number(unit_price) * Number(qty);
      }, 0)
      .toLocaleString();
  };

  const footerGroup = expenses.length > 0 && (
    <ColumnGroup>
      <Row>
        <Column
          colSpan={4}
          footer="T o t a l"
          footerStyle={{
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
            color: "#000",
          }}
        />
        <Column
          footer={calculateOverallTotalPriceTotal}
          footerStyle={{
            color: "#ff8e29",
          }}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="w-full p-8 flex flex-col">
      <div className="place-content-between flex flex-wrap gap-4">
        <input
          type="month"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input bg-white w-fit mb-4 self-start"
        />

        <NavLink
          to={user?.data.role !== "admin" ? "" : "/expenses/ppe/create"}
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
          footerColumnGroup={footerGroup}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No expenses found."
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
            backgroundColor: "white",
          }}
        >
          <Column field="item" header="Item Name"></Column>
          <Column field="unit" header="Unit"></Column>
          <Column field="qty" header="QTY"></Column>
          <Column field="unit_price" header="Unit Price"></Column>
          <Column
            header="Total Price"
            body={({ unit_price, qty }) =>
              (Number(unit_price) * Number(qty)).toLocaleString()
            }
          ></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
