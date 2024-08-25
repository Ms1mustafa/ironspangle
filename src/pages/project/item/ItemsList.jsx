import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/project/item/Delete";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

export default function ItemsList() {
  const user = AuthCheck();
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/project/item/list.php?project_id=${id}`
      );
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching Items:", error);
      toast.error("Failed to fetch Items.");
    } finally {
      setLoading(false);
    }
  };

  const refreshItems = () => {
    getItems();
  };

  const actionTemplate = (item) => (
    <div className="flex gap-2">
      <Menu as="div" className="absolute place-self-center">
        <div>
          <MenuButton className="flex items-center space-x-2 rounded-full focus:outline-none">
            <span className="hidden sm:inline ml-2 text-lg font-bold">...</span>
          </MenuButton>
        </div>
        <MenuItems
          transition
          className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <MenuItem>
            <NavLink
              to={`/projects/${id}/items/${item.id}/edit`}
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
            >
              Edit
            </NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
              onClick={() =>
                SweetAlert({
                  props: {
                    title: "Are you sure?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Delete",
                    onConfirm: () => {
                      Delete(item.id, setLoading, refreshItems);
                    },
                  },
                })
              }
            >
              Delete
            </NavLink>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );

  const total_price = (item) =>
    (Number(item.qty) * Number(item.unit_price)).toLocaleString();
  const total_cost = (item) =>
    (
      Number(item.qty) * Number(item.unit_price) +
      Number(item.trans)
    ).toLocaleString();

  const calculateTotalCost = () =>
    items
      .reduce(
        (total, item) =>
          total +
          Number(item.trans) +
          Number(item.qty) * Number(item.unit_price),
        0
      )
      .toLocaleString();

  const footerGroup = items.length > 0 && (
    <ColumnGroup>
      <Row>
        <Column
          colSpan={6}
          footer="T o t a l"
          footerStyle={{
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
            color: "#000",
          }}
        />
        <Column
          footer={calculateTotalCost}
          footerStyle={{ color: "#ff8e29", fontWeight: "bold" }}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="w-full py-8 flex flex-col">
      <NavLink
        to={`/projects/${id}/items/create`}
        className="button mb-4 self-end"
        disabled={user?.data.role !== "admin"}
      >
        Create Item
      </NavLink>
      <div className="card">
        <DataTable
          value={items}
          paginator
          rows={5}
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]}
          footerColumnGroup={footerGroup}
          emptyMessage="No Items found."
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
            fontSize: "14px",
            backgroundColor: "#fff",
          }}
        >
          <Column
            field="name"
            header="Name"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />
          <Column field="unit" header="Unit" />
          <Column field="qty" header="QTY" />
          <Column
            header="Unit Price"
            body={(rowData) =>
              rowData?.unit_price ? rowData.unit_price.toLocaleString() : ""
            }
          />
          <Column header="Total Price" body={total_price} />
          <Column
            header="Trans"
            body={(rowData) =>
              rowData?.trans ? rowData.trans.toLocaleString() : ""
            }
          />
          <Column header="Total Cost" body={total_cost} />
          <Column field="date" header="Date" />
          <Column field="remarks" header="Remarks" />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
}
