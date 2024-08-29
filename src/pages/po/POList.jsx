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
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

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
                to={`/po/${po.id}/edit`}
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
                        Delete(po.id, setLoading, refreshPO);
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
        <Column colSpan={4} footerStyle={{}} />
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
      <NavLink
        to={user?.data.role !== "admin" ? "" : `/po/create`}
        className="button mb-4 self-end"
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
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
            backgroundColor: "#fff",
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
