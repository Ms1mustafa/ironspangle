import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../API/account/AuthCheck";
import SweetAlert from "../../components/SweetAlert";
import Delete from "../../API/swift/Delete";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

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
                to={`/swift/${swift.id}/view`}
                className="menuItem-link"
                disabled={user?.data.role !== "admin"}
              >
                view
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink
                to={`/swift/${swift.id}/edit`}
                className="menuItem-link"
                disabled={user?.data.role !== "admin"}
              >
                Edit
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink
                to={`/swift/${swift.id}/assign_invoice`}
                className="menuItem-link"
                disabled={user?.data.role !== "admin"}
              >
                Assign invoice
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
                        Delete(swift.id, setLoading, refreshSwift);
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
        to={user?.data.role !== "admin" ? "" : `/swift/create`}
        className="button mb-4 self-end"
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
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column field="swift" header="Swift"></Column>
          <Column
            header="Total Cost"
            body={(rowData) =>
              Number(rowData.total_invoices_cost).toLocaleString()
            }
          ></Column>
          <Column field="date" header="Date"></Column>
          <Column field="receive_at_bank" header="Received at bank"></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
