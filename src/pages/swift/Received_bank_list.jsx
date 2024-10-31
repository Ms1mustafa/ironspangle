import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Banknote, CheckCheck, NotepadText, SquareMinus } from "lucide-react";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../API/account/AuthCheck";
import Remove_swift from "../../API/swift/invoice/Remove_swift";
import SweetAlert from "../../components/SweetAlert";

export default function InvoiceTableDemo() {
  const [swiftData, setSwiftData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = AuthCheck();
  const { id } = useParams();

  async function fetchData() {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/swift/received_bank.php?swift_id=${id}`
      );
      // Assuming response.data is an array with the format [{ swift: "1", invoices: [...] }, {...}]
      const data = response.data;
      setSwiftData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Menu as="div" className="place-self-center">
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
                to={`/invoice/${rowData.id}/edit_values`}
                className="menuItem-link"
                disabled={user?.data.role !== "admin"}
              >
                Edit Values
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
                      confirmButtonText: "Remove",
                      onConfirm: () => {
                        Remove_swift(rowData, setLoading, fetchData);
                      },
                    },
                  })
                }
                disabled={user?.data.role !== "admin"}
              >
                Remove from swift
              </NavLink>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    );
  };

  // Flatten the data for the DataTable
  const flattenedData = swiftData.flatMap((item) =>
    item.invoices.map((invoice) => ({
      ...invoice,
      swift: item.swift,
    }))
  );

  //totals
  const calculateOverallCost = () => {
    return flattenedData.reduce((total, data) => {
      const { cost } = data;
      return total + Number(cost);
    }, 0);
  };

  const calculateOverallGuarantee = () => {
    return flattenedData.reduce((total, data) => {
      const { cost } = data;
      const guarantee = data.guarantee > 0 ? cost * 0.05 : 0;
      return total + Number(guarantee);
    }, 0);
  };

  const calculateOverallTax = () => {
    return flattenedData.reduce((total, data) => {
      const { cost } = data;
      const tax = data.tax > 0 ? cost * 0.03 : 0;
      return total + Number(tax);
    }, 0);
  };

  const calculateOverallPublish = () => {
    return flattenedData.reduce((total, data) => {
      const { publish } = data;
      return total + Number(publish);
    }, 0);
  };

  const calculateOverallFines = () => {
    return flattenedData.reduce((total, data) => {
      const { fines } = data;
      return total + Number(fines);
    }, 0);
  };

  const calculateOverallReceived = () => {
    return (
      Number(calculateOverallCost()) -
      Number(calculateOverallGuarantee()) -
      Number(calculateOverallTax()) -
      Number(calculateOverallPublish()) -
      Number(calculateOverallFines())
    ).toLocaleString();
  };

  //footer group
  const footerGroup = flattenedData.length > 0 && (
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
          footer={calculateOverallCost().toLocaleString()}
          footerStyle={{
            color: "#ff8e29",
          }}
        />
        <Column
          footer={calculateOverallGuarantee().toLocaleString()}
          footerStyle={{
            color: "#ff8e29",
          }}
        />
        <Column
          footer={calculateOverallTax().toLocaleString()}
          footerStyle={{
            color: "#ff8e29",
          }}
        />
        <Column
          footer={calculateOverallPublish().toLocaleString()}
          footerStyle={{
            color: "#ff8e29",
          }}
        />
        <Column
          footer={calculateOverallFines().toLocaleString()}
          footerStyle={{
            color: "#ff8e29",
          }}
        />
        <Column
          footer={calculateOverallReceived}
          footerStyle={{
            color: "#ff8e29",
          }}
        />
      </Row>
    </ColumnGroup>
  );
  return (
    <div className="w-full p-10">
      <div className="card w-[70rem]">
        <DataTable
          value={flattenedData}
          rowGroupMode="rowspan"
          footerColumnGroup={footerGroup}
          showGridlines
          groupRowsBy="swift"
          sortMode="single"
          sortField="swift"
          sortOrder={1}
          tableStyle={{ minWidth: "50rem", backgroundColor: "white" }}
        >
          <Column
            field="swift"
            header="Swift"
            style={{ minWidth: "150px" }}
            headerStyle={{ color: "#ff8e29" }} // Apply header text color directly
          ></Column>
          <Column
            field="invoice_no"
            header="Invoice No"
            style={{ minWidth: "150px" }}
            headerStyle={{ color: "#ff8e29" }}
          ></Column>
          <Column
            field="description"
            header="Name"
            style={{ minWidth: "250px" }}
            headerStyle={{ color: "#ff8e29" }}
          ></Column>
          <Column
            field="s_no"
            header="S"
            style={{ minWidth: "250px" }}
            headerStyle={{ color: "#ff8e29" }}
          ></Column>
          <Column
            header="Cost"
            style={{ minWidth: "150px" }}
            headerStyle={{ color: "#ff8e29" }}
            body={(rowData) => Number(rowData.cost).toLocaleString()}
          ></Column>
          <Column
            header="Guarantee 5%"
            style={{ minWidth: "150px" }}
            headerStyle={{ color: "#ff8e29" }}
            body={(rowData) =>
              (rowData.guarantee > 0 &&
                Number(rowData.cost * 0.05).toLocaleString()) ||
              0
            }
          ></Column>
          <Column
            header="Tax 3%"
            style={{ minWidth: "150px" }}
            headerStyle={{ color: "#ff8e29" }}
            body={(rowData) =>
              (rowData.tax > 0 &&
                Number(rowData.cost * 0.03).toLocaleString()) ||
              0
            }
          ></Column>
          <Column
            header="Publish"
            style={{ minWidth: "150px" }}
            headerStyle={{ color: "#ff8e29" }}
            body={(rowData) => Number(rowData.publish).toLocaleString()}
          ></Column>
          <Column
            header="Fines"
            style={{ minWidth: "150px" }}
            headerStyle={{ color: "#ff8e29" }}
            body={(rowData) => Number(rowData.fines).toLocaleString()}
          ></Column>
          <Column
            header="Tax bint"
            style={{ minWidth: "150px" }}
            headerStyle={{ color: "#ff8e29" }}
            body={(rowData) => Number(rowData.tax_bint).toLocaleString()}
          ></Column>
          <Column
            header="Received"
            style={{ minWidth: "150px" }}
            headerStyle={{ color: "#ff8e29" }}
            body={(rowData) =>
              Number(
                rowData.cost -
                  (rowData.guarantee > 0 && rowData.cost * 0.05) -
                  (rowData.tax > 0 && rowData.cost * 0.03) -
                  rowData.publish -
                  rowData.fines -
                  rowData.tax_bint
              ).toLocaleString()
            }
          ></Column>
          <Column body={actionTemplate} style={{ minWidth: "150px" }}></Column>
        </DataTable>
      </div>
    </div>
  );
}
