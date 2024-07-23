import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../../../API/account/AuthCheck";
import Button from "../../../../components/Button";
import SweetAlert from "../../../../components/SweetAlert";
import Delete from "../../../../API/expenses/sd/worker/Delete";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function SDWorkersList() {
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
        }/expense/sd/worker/list.php?sd_id=${id}`
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
          to={`/projects/${id}/workers/${rowData.id}/edit`}
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
    return ((day + night) * cost_day + hours * cost_hour).toLocaleString();
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
    const { day, food, transportation } = rowData;
    const totalFood = day * food;
    const totalTransportation = day * transportation;
    return (totalFood + totalTransportation).toLocaleString();
  };

  // Calculate overall totals for footer
  const calculateOverallTotalSalary = () => {
    return workers
      .reduce((total, worker) => {
        const { day, night, cost_day, hours, cost_hour } = worker;
        return total + ((day + night) * cost_day + hours * cost_hour);
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalFood = () => {
    return workers
      .reduce((total, worker) => {
        const { day, food } = worker;
        return total + day * food;
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalTransportation = () => {
    return workers
      .reduce((total, worker) => {
        const { day, transportation } = worker;
        return total + day * transportation;
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalCost = () => {
    return workers
      .reduce((total, worker) => {
        const { day, food, transportation } = worker;
        const totalFood = day * food;
        const totalTransportation = day * transportation;
        return total + totalFood + totalTransportation;
      }, 0)
      .toLocaleString();
  };

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer="Total"
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "#980000",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
        <Column
          footerStyle={{
            backgroundColor: "#00427f",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
        <Column
          footerStyle={{
            backgroundColor: "#00427f",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
        <Column
          footerStyle={{
            backgroundColor: "#00427f",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
        <Column footerStyle={{ backgroundColor: "#00427f" }} />
        <Column footerStyle={{ backgroundColor: "#00427f" }} />
        <Column
          footer={calculateOverallTotalSalary}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "#00427f",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
        <Column footerStyle={{ backgroundColor: "#00427f" }} />
        <Column
          footer={calculateOverallTotalFood}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "#00427f",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
        <Column footerStyle={{ backgroundColor: "#00427f" }} />
        <Column
          footer={calculateOverallTotalTransportation}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "#00427f",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalCost}
          footerStyle={{
            // textAlign: "center",
            backgroundColor: "#00427f",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="w-full py-8 px-4 flex flex-col">
      <NavLink
        to={`/projects/${id}/workers/create`}
        className="button mb-4 self-end"
        disabled={user?.data.role !== "admin"}
      >
        Create Worker
      </NavLink>
      <div className="card">
        <DataTable
          value={workers}
          paginator
          rows={5}
          showGridlines
          stripedRows
          footerColumnGroup={footerGroup}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No Workers found."
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="name" header="Name" sortable />
          <Column field="day" header="Day" sortable />
          <Column field="night" header="Night" sortable />
          <Column field="hours" header="Hours" sortable />
          <Column
            field="cost_hour"
            header="Cost / Hour"
            sortable
            body={(rowData) =>
              rowData?.cost_hour ? rowData.cost_hour.toLocaleString() : ""
            }
          />
          <Column
            field="cost_day"
            header="Cost / Day"
            sortable
            body={(rowData) =>
              rowData?.cost_day ? rowData.cost_day.toLocaleString() : ""
            }
          />

          <Column header="Total Salary" body={calculateTotalSalary} sortable />
          <Column
            field="food"
            header="Food"
            body={(rowData) =>
              rowData?.food ? rowData.food.toLocaleString() : ""
            }
            sortable
          />
          <Column header="Total Food" body={calculateTotalFood} sortable />
          <Column
            field="transportation"
            header="Transportation"
            body={(rowData) =>
              rowData?.transportation
                ? rowData.transportation.toLocaleString()
                : ""
            }
            sortable
          />
          <Column
            header="Total Transportation"
            body={calculateTotalTransportation}
            sortable
          />
          <Column header="Total Cost" body={calculateTotalCost} sortable />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
}
