import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/supply_chain/worker/Delete";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function Supply_chainWorkersList() {
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
        }/supply_chain/worker/list.php?supply_chain_id=${id}`
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
          to={`/supply_chain/${id}/workers/${rowData.id}/edit`}
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

  // Calculate overall totals for footer
  const calculateOverallTotalContract = () => {
    return workers
      .reduce((total, worker) => {
        const { contract_salary, active_days } = worker;
        return total + Number(contract_salary) * Number(active_days);
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalSalary = () => {
    return workers
      .reduce((total, worker) => {
        const { labor_salary, active_days, insurance2 } = worker;
        return total + Number(labor_salary * active_days) - Number(insurance2);
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

  const calculateOverallTotalInsurance2 = () => {
    return workers
      .reduce((total, worker) => {
        const { insurance2 } = worker;
        return total + Number(insurance2);
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
          colSpan={4}
          footerStyle={{
            backgroundColor: "#fff",
          }}
        />
        <Column
          footer={calculateOverallTotalContract}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "yellow",
            color: "#000",
            fontWeight: "bold",
          }}
        />
        <Column
          colSpan={1}
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
          footer={calculateOverallTotalTransportation}
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
          footer={calculateOverallTotalPPE}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "yellow",
            color: "#000",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalInsurance2}
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
        to={`/supply_chain/${id}/workers/create`}
        className="button mb-4 self-end"
        disabled={user?.data.role !== "supply_chain"}
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
            field="job"
            header="Job"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />
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
            header="Total Contract"
            body={(rowData) =>
              rowData?.contract_salary && rowData?.active_days
                ? Number(
                    rowData.contract_salary * rowData.active_days
                  ).toLocaleString()
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
            header="Total Labor Salary"
            body={(rowData) =>
              rowData?.labor_salary &&
              rowData?.active_days &&
              rowData?.insurance2
                ? (
                    Number(rowData.labor_salary * rowData.active_days) -
                    Number(rowData.insurance2)
                  ).toLocaleString()
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
            header="Insurance"
            field="insurance"
            body={(rowData) =>
              rowData?.insurance
                ? Number(rowData.insurance).toLocaleString()
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
          <Column
            header="Insurance 2"
            field="insurance2"
            body={(rowData) =>
              rowData?.insurance2
                ? Number(rowData.insurance2).toLocaleString()
                : ""
            }
          />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
}
