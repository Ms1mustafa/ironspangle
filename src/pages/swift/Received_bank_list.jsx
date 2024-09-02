import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Banknote, CheckCheck, NotepadText, SquareMinus } from "lucide-react";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function InvoiceTableDemo() {
  const [swiftData, setSwiftData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/swift/received_bank.php`
        );
        // Assuming response.data is an array with the format [{ swift: "1", invoices: [...] }, {...}]
        const data = response.data;
        setSwiftData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

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
      const { guarantee } = data;
      return total + Number(guarantee);
    }, 0);
  };

  const calculateOverallTax = () => {
    return flattenedData.reduce((total, data) => {
      const { tax } = data;
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
      <Row>
        <Column colSpan={5} footerStyle={{ backgroundColor: "#fff" }} />
        <Column
          colSpan={3}
          footer={(
            calculateOverallGuarantee() +
            calculateOverallTax() +
            calculateOverallPublish()
          ).toLocaleString()}
          footerStyle={{
            color: "#fff",
            textAlign: "center",
            backgroundColor: "#ff8e29",
          }}
        />
      </Row>
    </ColumnGroup>
  );
  return (
    <div className="w-full p-10">
      <div className="flex gap-4 mb-6">
        <div className="count-card">
          <div className="count-card-inner">
            <Banknote size={55} className="count-card-icon bg-[#f54f5f]" />
            <div className="count-card-info">
              <p>Total Send</p>
              <span>{calculateOverallCost().toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <SquareMinus size={55} className="count-card-icon bg-[#67cadf]" />
            <div className="count-card-info">
              <p>Total Deduction</p>
              <span>{calculateOverallGuarantee().toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <CheckCheck size={55} className="count-card-icon bg-[#27d095]" />
            <div className="count-card-info">
              <p>Total Received</p>
              <span>{calculateOverallReceived().toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="count-card">
          <div className="count-card-inner">
            <NotepadText size={55} className="count-card-icon bg-[#ffbc56]" />
            <div className="count-card-info">
              <p>Total Fines</p>
              <span>{calculateOverallFines().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card w-[70rem]">
        <DataTable
          value={flattenedData}
          rowGroupMode="rowspan"
          footerColumnGroup={footerGroup}
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
            body={(rowData) => Number(rowData.cost * 0.05).toLocaleString()}
          ></Column>
          <Column
            header="Tax 3%"
            style={{ minWidth: "150px" }}
            headerStyle={{ color: "#ff8e29" }}
            body={(rowData) => Number(rowData.cost * 0.03).toLocaleString()}
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
            header="Received"
            style={{ minWidth: "150px" }}
            headerStyle={{ color: "#ff8e29" }}
            body={(rowData) =>
              Number(
                rowData.cost -
                  rowData.guarantee -
                  rowData.tax -
                  rowData.publish -
                  rowData.fines
              ).toLocaleString()
            }
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
