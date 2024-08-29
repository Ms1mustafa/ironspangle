import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../API/account/AuthCheck";
import Button from "../../components/Button";
import SweetAlert from "../../components/SweetAlert";
import Delete from "../../API/mec/Delete";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

export default function MecList() {
  const user = AuthCheck();

  const [mec, setMec] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));

  async function getMec() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/mec/list.php?date=${date}`
      );
      setMec(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching MEC:", error);
      toast.error("Failed to fetch MEC.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getMec();
  }, [date]);

  const refreshMec = () => {
    getMec(); // Function to refresh mec list
  };

  const actionTemplate = (mec) => {
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
              <NavLink to={`/mec/${mec.id}/workers`} className="menuItem-link">
                View
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink
                to={`/mec/${mec.id}/edit`}
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
                        Delete(mec.id, setLoading, refreshMec);
                      },
                    },
                  })
                }
                disabled={user?.data.role !== "admin"}
              >
                Delete
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink
                to={`/mec/${mec.id}/copy`}
                className="menuItem-link"
                disabled={user?.data.role !== "admin"}
              >
                Copy
              </NavLink>
            </MenuItem>
          </MenuItems>
        </Menu>
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
          className="input bg-white w-fit mb-4 self-start"
        />
        <NavLink
          to={user?.data.role !== "admin" ? "" : "/mec/create"}
          className="button mb-4 self-end"
        >
          Create MEC
        </NavLink>
      </div>
      <div className="card">
        <DataTable
          value={mec}
          showGridlines
          emptyMessage="No mec found."
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column
            header="Fixed Invoice Cost"
            body={(rowData) =>
              rowData?.fixed_invoice_cost
                ? Number(rowData.fixed_invoice_cost).toLocaleString()
                : ""
            }
          ></Column>
          <Column
            header="PO"
            body={(rowData) =>
              rowData?.po ? Number(rowData.po).toLocaleString() : ""
            }
          ></Column>
          <Column
            header="PR"
            body={(rowData) =>
              rowData?.pr ? Number(rowData.pr).toLocaleString() : ""
            }
          ></Column>
          <Column field="date" header="Date"></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
