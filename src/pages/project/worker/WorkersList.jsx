import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/project/worker/Delete";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function WorkersList() {
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
        }/project/worker/list.php?project_id=${id}`
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
  const calculateOverallTotalSalary = () => {
    return workers
      .reduce((total, worker) => {
        const { day, night, cost_day, hours, cost_hour } = worker;
        return (
          total +
          ((Number(day) + Number(night)) * Number(cost_day) +
            Number(hours) * Number(cost_hour))
        );
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalFood = () => {
    return workers
      .reduce((total, worker) => {
        const { day, food } = worker;
        return total + Number(day) * Number(food);
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalTransportation = () => {
    return workers
      .reduce((total, worker) => {
        const { day, transportation } = worker;
        return total + Number(day) * Number(transportation);
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalCost = () => {
    return workers
      .reduce((total, worker) => {
        const { day, food, transportation, night, cost_day, hours, cost_hour } =
          worker;
        const totalFood = Number(day) * Number(food);
        const totalTransportation = Number(day) * Number(transportation);
        const totalSalary =
          (Number(day) + Number(night)) * Number(cost_day) +
          Number(hours) * Number(cost_hour);
        return total + totalSalary + totalFood + totalTransportation;
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
    <div className="w-full py-8 flex flex-col">
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
          tableStyle={{ minWidth: "50rem", fontSize: "16px" }}
        >
          <Column field="name" header="Name" />
          <Column field="day" header="Day" />
          <Column field="night" header="Night" />
          <Column field="hours" header="Hours" />
          <Column
            field="cost_hour"
            header="Cost / Hour"
            body={(rowData) =>
              rowData?.cost_hour ? rowData.cost_hour.toLocaleString() : ""
            }
          />
          <Column
            field="cost_day"
            header="Cost / Day"
            body={(rowData) =>
              rowData?.cost_day ? rowData.cost_day.toLocaleString() : ""
            }
          />

          <Column header="Total Salary" body={calculateTotalSalary} />
          <Column
            field="food"
            header="Food"
            body={(rowData) =>
              rowData?.food ? rowData.food.toLocaleString() : ""
            }
          />
          <Column header="Total Food" body={calculateTotalFood} />
          <Column
            field="transportation"
            header="Transportation"
            body={(rowData) =>
              rowData?.transportation
                ? rowData.transportation.toLocaleString()
                : ""
            }
          />
          <Column
            header="Total Transportation"
            body={calculateTotalTransportation}
          />
          <Column header="Total Cost" body={calculateTotalCost} />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
}
