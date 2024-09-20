import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/expenses/sd/Delete";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import GetTotals from "../../../API/expenses/sd/GetTotals"; // Import your GetTotals function

export default function SDsList() {
  const user = AuthCheck();

  const [SDs, setSDs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getSDs() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/expense/sd/list.php`
      );
      const sdList = response.data;

      // Fetch totals for each SD
      const updatedSDs = await Promise.all(
        sdList.map(async (sd) => {
          const totals = await GetTotals(sd.id, setLoading);
          return { ...sd, ...totals }; // Merge SD data with totals
        })
      );

      setSDs(updatedSDs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching SDs:", error);
      toast.error("Failed to fetch SDs.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getSDs();
  }, []);

  const refreshSDs = () => {
    getSDs(); // Function to refresh SDs list
  };

  const actionTemplate = (SDs) => {
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
          <MenuItems className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
            <MenuItem>
              <NavLink
                to={`/expenses/sd/${SDs.id}/workers`}
                className="menuItem-link"
              >
                View
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink
                to={`/expenses/sd/${SDs.id}/edit`}
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
                      title:
                        "By deleting this SD, all associated workers will also be deleted. Are you sure?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Delete",
                      onConfirm: () => {
                        Delete(SDs.id, setLoading, refreshSDs);
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

  return (
    <div className="w-full p-8 flex flex-col">
      <NavLink
        to={user?.data.role !== "admin" ? "" : "/expenses/sd/create"}
        className="button mb-4 self-end"
      >
        Create SD
      </NavLink>
      <div className="card">
        <DataTable
          value={SDs}
          paginator
          rows={5}
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No SDs found."
          loading={loading}
          tableStyle={{ minWidth: "50rem", backgroundColor: "white" }}
        >
          <Column field="name" header="Name"></Column>
          <Column field="budget" header="PO cost"></Column>
          <Column field="isg" header="ISG"></Column>
          <Column
            header="Profit"
            body={(data) =>
              (
                Number(data.budget) - Number(data.total_sd_cost)
              ).toLocaleString()
            }
          ></Column>
          <Column
            header="Total sd cost"
            body={(data) => Number(data.total_sd_cost).toLocaleString()}
          ></Column>
          <Column
            header="Lafarge"
            body={(data) =>
              (Number(data.po) - Number(data.isg)).toLocaleString()
            }
          ></Column>
          <Column field="po" header="PO cost"></Column>
          <Column field="pr" header="PR cost"></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
