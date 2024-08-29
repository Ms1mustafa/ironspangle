import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../API/account/AuthCheck";
import Button from "../../components/Button";
import SweetAlert from "../../components/SweetAlert";
import Delete from "../../API/supply_chain/Delete";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

export default function Supply_chainList() {
  const user = AuthCheck();

  const [supply_chain, setSupply_chain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));

  async function getSupply_chain() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/supply_chain/list.php?date=${date}`
      );
      setSupply_chain(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Supply chain:", error);
      toast.error("Failed to fetch Supply chain.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getSupply_chain();
  }, [date]);

  const refreshSupply_chain = () => {
    getSupply_chain(); // Function to refresh supply_chain list
  };

  const actionTemplate = (supply_chain) => {
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
                to={`/supply_chain/${supply_chain.id}/workers`}
                className="menuItem-link"
              >
                View
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink
                to={`/supply_chain/${supply_chain.id}/edit`}
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
                        Delete(
                          supply_chain.id,
                          setLoading,
                          refreshSupply_chain
                        );
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
                to={`/supply_chain/${supply_chain.id}/copy`}
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
          to={user?.data.role !== "admin" ? "" : "/supply_chain/create"}
          className="button mb-4 self-end"
        >
          Create Supply Chain
        </NavLink>
      </div>
      <div className="card">
        <DataTable
          value={supply_chain}
          showGridlines
          emptyMessage="No supply_chain found."
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
            backgroundColor: "white",
          }}
        >
          <Column header="PO" field="po"></Column>
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
