import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import GetTotals from "../../API/summary/GetTotals";
import { Calendar } from "primereact/calendar";
import toast from "react-hot-toast";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function Summary() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    adminTotals: [],
    mecTotals: [],
    supplyChainTotals: [],
    employeeCompanyTotals: [],
  });
  const [date, setDate] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const handleYearChange = (e) => {
    if (e.value) {
      const year = e.value.getFullYear();
      setDate(year);
    } else {
      setDate(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const totalsData = await GetTotals(date, setLoading, navigate);
        setTotals(totalsData);
      } catch (error) {
        toast.error("Failed to fetch totals.");
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      fetchData();
    }
  }, [date, navigate]);

  // Aggregate data by month for various fields
  const aggregateTotalsByMonth = (data) => {
    console.log("Data to aggregate:", data); // Debugging line

    return data.reduce((acc, item) => {
      const month = item.month
        ? new Date(item.month + "-01").toLocaleString("default", {
            month: "long",
          })
        : null;
      if (month) {
        if (!acc[month]) {
          acc[month] = {
            fixed_invoice_cost: 0,
            total_contract_salary: 0,
            insurance: 0,
            total_labor_salary: 0,
            transportation: 0,
            ppe: 0,
            total_contract_salary_admin: 0,
            total_contract_salary_supply_chain: 0,
            employee_company: 0,
          };
        }
        acc[month].fixed_invoice_cost += Number(item.fixed_invoice_cost) || 0;
        acc[month].total_contract_salary +=
          Number(item.total_contract_salary) || 0;
        acc[month].insurance += Number(item.insurance) || 0;
        acc[month].total_labor_salary += Number(item.total_labor_salary) || 0;
        acc[month].transportation += Number(item.transportation) || 0;
        acc[month].ppe += Number(item.ppe) || 0;

        if (item.type === "admin") {
          acc[month].total_contract_salary_admin +=
            Number(item.total_contract_salary) || 0;
        } else if (item.type === "supplyChain") {
          acc[month].total_contract_salary_supply_chain +=
            Number(item.total_contract_salary) || 0;
        } else if (item.type === "employeeCompany") {
          acc[month].employee_company += Number(item.employee_company) || 0;
        }
      }
      return acc;
    }, {});
  };

  // Combine all totals data
  const combinedData = [
    ...(Array.isArray(totals.adminTotals) ? totals.adminTotals : []),
    ...(Array.isArray(totals.mecTotals) ? totals.mecTotals : []),
    ...(Array.isArray(totals.supplyChainTotals)
      ? totals.supplyChainTotals
      : []),
    ...(Array.isArray(totals.employeeCompanyTotals)
      ? totals.employeeCompanyTotals
      : []),
  ];

  console.log("Combined Data:", combinedData); // Debugging line

  // Aggregate data by month
  const aggregatedTotals = aggregateTotalsByMonth(combinedData);

  console.log("Aggregated Totals:", aggregatedTotals); // Debugging line

  // Convert aggregatedTotals to array format for DataTable
  const dataForTable = monthNames.map((month) => ({
    month,
    fixed_invoice_cost: aggregatedTotals[month]?.fixed_invoice_cost || 0,
    total_contract_salary: aggregatedTotals[month]?.total_contract_salary || 0,
    insurance: aggregatedTotals[month]?.insurance || 0,
    total_labor_salary: aggregatedTotals[month]?.total_labor_salary || 0,
    transportation: aggregatedTotals[month]?.transportation || 0,
    ppe: aggregatedTotals[month]?.ppe || 0,
    total_contract_salary_admin:
      totals.adminTotals.find(
        (item) =>
          new Date(item.month + "-01").toLocaleString("default", {
            month: "long",
          }) === month
      )?.total_contract_salary || 0,

    total_contract_salary_supply_chain:
      totals.supplyChainTotals.find(
        (item) =>
          new Date(item.month + "-01").toLocaleString("default", {
            month: "long",
          }) === month
      )?.total_contract_salary || 0,

    employee_salary:
      totals.employeeCompanyTotals.find(
        (item) =>
          new Date(item.date + "-01").toLocaleString("default", {
            month: "long",
          }) === month
      )?.employee_salary || 0,
  }));

  const calculateFooterTotals = (column) => {
    return dataForTable
      .reduce((sum, row) => sum + (Number(row[column]) || 0), 0)
      .toLocaleString();
  };

  // Define the footer group
  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footerStyle={{ backgroundColor: "#f4f4f4" }}
          footer="Total"
          colSpan={1}
        />
        <Column
          footer={calculateFooterTotals("fixed_invoice_cost")}
          footerStyle={{ backgroundColor: "#f4f4f4" }}
        />
        <Column
          footer={calculateFooterTotals("total_contract_salary")}
          footerStyle={{ backgroundColor: "#f4f4f4" }}
        />
        <Column
          footer={calculateFooterTotals("total_contract_salary_admin")}
          footerStyle={{ backgroundColor: "#f4f4f4" }}
        />
        <Column
          footer={calculateFooterTotals("total_contract_salary_supply_chain")}
          footerStyle={{ backgroundColor: "#f4f4f4" }}
        />
        <Column
          footer={calculateFooterTotals("total_labor_salary")}
          footerStyle={{ backgroundColor: "#f4f4f4" }}
        />
        <Column
          footer={calculateFooterTotals("transportation")}
          footerStyle={{ backgroundColor: "#f4f4f4" }}
        />
        <Column
          footer={calculateFooterTotals("insurance")}
          footerStyle={{ backgroundColor: "#f4f4f4" }}
        />
        <Column
          footer={calculateFooterTotals("ppe")}
          footerStyle={{ backgroundColor: "#f4f4f4" }}
        />
        <Column
          footer={calculateFooterTotals("employee_salary")}
          footerStyle={{ backgroundColor: "#f4f4f4" }}
        />
        <Column
          footer={(
            calculateFooterTotals("total_contract_salary") -
            calculateFooterTotals("total_labor_salary") -
            calculateFooterTotals("transportation") -
            calculateFooterTotals("insurance") -
            calculateFooterTotals("ppe") -
            calculateFooterTotals("employee_salary")
          ).toLocaleString()}
          footerStyle={{ backgroundColor: "#f4f4f4" }}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="w-full p-8 flex flex-col">
      <div className="place-content-between flex flex-wrap gap-4">
        <Calendar
          value={date ? new Date(date, 0, 1) : null}
          onChange={handleYearChange}
          view="year"
          dateFormat="yy"
          placeholder="Select year"
          yearNavigator
          yearRange="1900:2100"
        />
      </div>
      <div className="card">
        <DataTable
          value={dataForTable}
          showGridlines
          //   footerColumnGroup={footerGroup}
          emptyMessage="No data found."
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column header="Month" field="month" />
          <Column
            header="Invoice cost"
            body={(rowData) =>
              (
                Number(rowData.fixed_invoice_cost) +
                Number(rowData.total_contract_salary_admin) +
                Number(rowData.total_contract_salary_supply_chain)
              ).toLocaleString()
            }
          />
          <Column
            header="PO ISG"
            body={(rowData) =>
              Number(rowData.total_contract_salary).toLocaleString()
            }
          />
          <Column
            header="PO Lafarge"
            body={(rowData) =>
              (
                Number(rowData.fixed_invoice_cost) +
                Number(rowData.total_contract_salary_admin) +
                Number(rowData.total_contract_salary_supply_chain) -
                Number(rowData.total_contract_salary)
              ).toLocaleString()
            }
          />
          <Column
            header="Labor Cost"
            body={(rowData) =>
              Number(rowData.total_labor_salary).toLocaleString()
            }
          />
          <Column
            header="Transportation"
            body={(rowData) => Number(rowData.transportation).toLocaleString()}
          />
          <Column
            header="Insurance"
            body={(rowData) => Number(rowData.insurance).toLocaleString()}
          />
          <Column
            header="PPE"
            body={(rowData) => Number(rowData.ppe).toLocaleString()}
          />
          <Column
            header="Employee company"
            body={(rowData) => Number(rowData.employee_salary).toLocaleString()}
          />
          <Column
            header="Profit"
            body={(rowData) => {
              const poISG = Number(rowData.total_contract_salary) || 0;
              const laborCost = Number(rowData.total_labor_salary) || 0;
              const transportation = Number(rowData.transportation) || 0;
              const insurance = Number(rowData.insurance) || 0;
              const ppe = Number(rowData.ppe) || 0;
              const employeeCompany = Number(rowData.employee_salary) || 0;

              const profit =
                poISG -
                (laborCost +
                  transportation +
                  insurance +
                  ppe +
                  employeeCompany);
              return profit.toLocaleString();
            }}
          />
        </DataTable>
      </div>
    </div>
  );
}
