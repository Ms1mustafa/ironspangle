import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/mec/worker/Delete";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function MecWorkersList() {
  const user = AuthCheck();
  const { id } = useParams();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWorkers();
  }, []);

  const getWorkers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/mec/worker/list.php?mec_id=${id}`
      );
      setWorkers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching workers:", error);
      toast.error("Failed to fetch workers.");
      setLoading(false);
    }
  };

  const refreshWorkers = () => {
    getWorkers();
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <NavLink
          to={`/mec/${id}/workers/${rowData.id}/edit`}
          className="button"
        >
          Edit
        </NavLink>
        <Button
          className="button bg-red-500 hover:bg-red-600"
          onClick={() =>
            SweetAlert({
              props: {
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                onConfirm: () => {
                  handleDelete(rowData.id);
                },
              },
            })
          }
        >
          Delete
        </Button>
      </div>
    );
  };

  const handleDelete = async (workerId) => {
    try {
      await Delete(workerId, setLoading, refreshWorkers);
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast.error("Failed to delete worker.");
    }
  };

  // Calculate individual worker totals
  const calculateTotalSalary = (rowData) => {
    const { day, night, cost_day, hours, cost_hour } = rowData;
    return (
      (Number(day) + Number(night)) * Number(cost_day) +
      Number(hours) * Number(cost_hour)
    ).toLocaleString();
  };

  const calculateTotalFood = (rowData) => {
    const { day, food } = rowData;
    return (day * food).toLocaleString();
  };

  const calculateTotalTransportation = (rowData) => {
    const { day, transportation } = rowData;
    return (day * transportation).toLocaleString();
  };

  const calculateTotalCost = (rowData) => {
    const { day, food, transportation, night, cost_day, hours, cost_hour } =
      rowData;
    const totalFood = Number(day) * Number(food);
    const totalTransportation = Number(day) * Number(transportation);
    const totalSalary =
      (Number(day) + Number(night)) * Number(cost_day) +
      Number(hours) * Number(cost_hour);
    return (totalSalary + totalFood + totalTransportation).toLocaleString();
  };

  // Calculate overall totals for footer
  const calculateOverallTotalActiveDays = () => {
    return workers
      .reduce((total, worker) => {
        const { active_days } = worker;
        return total + Number(active_days);
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalSalary = () => {
    return workers
      .reduce((total, worker) => {
        const { labor_salary, active_days } = worker;
        return total + Number(labor_salary * active_days);
      }, 0)
      .toLocaleString();
  };

  const calculateOverallContTotalSalary = () => {
    return workers
      .reduce((total, worker) => {
        const { contract_salary, active_days } = worker;
        return total + Number(contract_salary) * Number(active_days);
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalTransportation = () => {
    return workers
      .reduce((total, worker) => {
        const { transport, active_days } = worker;
        return total + Number(transport * active_days);
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalInsurance = () => {
    return workers
      .reduce((total, worker) => {
        const { insurance } = worker;
        return total + Number(insurance);
      }, 0)
      .toLocaleString();
  };
  const calculateOverallTotalPPE = () => {
    return workers
      .reduce((total, worker) => {
        const { ppe } = worker;
        return total + Number(ppe);
      }, 0)
      .toLocaleString();
  };

  const footerGroup = workers.length > 0 && (
    <ColumnGroup>
      <Row>
        <Column
          colSpan={3}
          footerStyle={{
            backgroundColor: "#fff",
          }}
        />
        <Column
          footer={calculateOverallTotalActiveDays}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "yellow",
            color: "#000",
            fontWeight: "bold",
          }}
        />
        <Column
          colSpan={2}
          footerStyle={{
            backgroundColor: "#fff",
          }}
        />
        <Column
          footer={calculateOverallTotalSalary}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "yellow",
            color: "#000",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallContTotalSalary}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "yellow",
            color: "#000",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalInsurance}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "yellow",
            color: "#000",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalTransportation}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "yellow",
            color: "#000",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalPPE}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "yellow",
            color: "#000",
            fontWeight: "bold",
          }}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="w-full py-8 flex flex-col">
      <NavLink
        to={`/mec/${id}/workers/create`}
        className="button mb-4 self-end"
        disabled={user?.data.role !== "mec"}
      >
        Create Worker
      </NavLink>
      <div className="card">
        <DataTable
          value={workers}
          paginator
          rows={5}
          showGridlines
          footerColumnGroup={footerGroup}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No Workers found."
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loading}
          tableStyle={{ minWidth: "50rem", fontSize: "14px" }}
        >
          <Column
            field="name"
            header="Name"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />
          <Column
            field="status"
            header="Status"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />
          <Column field="contract_days" header="Contract days" />
          <Column field="active_days" header="Active days" />
          <Column
            field="contract_salary"
            header="Contract salary"
            body={(rowData) =>
              rowData?.contract_salary
                ? Number(rowData.contract_salary).toLocaleString()
                : ""
            }
          />
          <Column
            field="labor_salary"
            header="Labor Salary"
            body={(rowData) =>
              rowData?.labor_salary
                ? Number(rowData.labor_salary).toLocaleString()
                : ""
            }
          />
          <Column
            header="Total Salary"
            body={(rowData) =>
              rowData?.labor_salary && rowData?.active_days
                ? Number(
                    rowData.labor_salary * rowData.active_days
                  ).toLocaleString()
                : ""
            }
          />

          <Column
            header="Total Cont sal"
            body={(rowData) =>
              rowData?.contract_salary && rowData?.contract_days
                ? Number(
                    rowData.contract_salary * rowData.contract_days
                  ).toLocaleString()
                : ""
            }
          />
          <Column
            header="Insurance"
            field="insurance"
            body={(rowData) =>
              rowData?.insurance
                ? Number(rowData.insurance).toLocaleString()
                : ""
            }
          />
          <Column
            header="Total Transportation"
            body={(rowData) =>
              rowData?.transport && rowData?.active_days
                ? Number(
                    rowData.transport * rowData.active_days
                  ).toLocaleString()
                : ""
            }
          />
          <Column
            header="PPE"
            field="ppe"
            body={(rowData) =>
              rowData?.ppe ? Number(rowData.ppe).toLocaleString() : ""
            }
          />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
}