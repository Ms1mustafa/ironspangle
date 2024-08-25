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
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

export default function SDWorkersList() {
  const user = AuthCheck();
  const { id } = useParams();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSDs();
  }, []);

  const getSDs = async () => {
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
    getSDs();
  };

  const actionTemplate = (rowData) => {
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
                to={`/expenses/sd/${id}/workers/${rowData.id}/edit`}
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
                        handleDelete(rowData.id);
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
  };

  const handleDelete = async (workerId) => {
    try {
      await Delete(workerId, setLoading, refreshWorkers);
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast.error("Failed to delete worker.");
    }
  };

  const calculateOverallTotalDays = () => {
    return workers
      .reduce((total, workers) => {
        const { days } = workers;
        return total + Number(days);
      }, 0)
      .toLocaleString();
  };
  const calculateOverallTotalTransportation = () => {
    return workers
      .reduce((total, workers) => {
        const { days, transportation } = workers;
        return total + Number(days) * Number(transportation);
      }, 0)
      .toLocaleString();
  };
  const calculateOverallTotalProfit = () => {
    return workers
      .reduce((total, workers) => {
        const { days, day_salary, day_cost, transportation } = workers;
        return (
          total +
          Number(Number(days) * Number(day_cost)) -
          Number(Number(days) * Number(transportation)) -
          Number(Number(day_salary) * Number(days))
        );
      }, 0)
      .toLocaleString();
  };
  const calculateOverallTotalSalary = () => {
    return workers
      .reduce((total, workers) => {
        const { days, day_salary } = workers;
        return total + Number(day_salary * days);
      }, 0)
      .toLocaleString();
  };

  const footerGroup = workers.length > 0 && (
    <ColumnGroup>
      <Row>
        <Column />
        <Column
          footer={calculateOverallTotalDays}
          footerStyle={{
            color: "#ff8e29",
          }}
        />
        <Column colSpan={2} />
        <Column
          footer={calculateOverallTotalTransportation}
          footerStyle={{
            color: "#ff8e29",
          }}
        />
        <Column colSpan={1} />
        <Column
          footer={calculateOverallTotalSalary}
          footerStyle={{
            color: "#ff8e29",
          }}
        />
        <Column
          footer={calculateOverallTotalProfit}
          footerStyle={{
            color: "#ff8e29",
          }}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="w-full py-8 px-4 flex flex-col">
      <NavLink
        to={`/expenses/sd/${id}/workers/create`}
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
          loading={loading}
          tableStyle={{ minWidth: "50rem", backgroundColor: "white" }}
        >
          <Column field="name" header="Name" />

          <Column field="days" header="Days" />
          <Column
            header="Cost / Day"
            body={(rowData) =>
              rowData?.day_cost ? Number(rowData.day_cost).toLocaleString() : ""
            }
          />
          <Column
            header="Total Contract Salarys"
            body={(rowData) =>
              rowData?.days && rowData?.day_cost
                ? (
                    Number(rowData.days) * Number(rowData.day_cost)
                  ).toLocaleString()
                : ""
            }
          />
          <Column
            header="Transportation"
            body={(rowData) =>
              rowData?.transportation
                ? (
                    Number(rowData.days) * Number(rowData.transportation)
                  ).toLocaleString()
                : ""
            }
          />
          <Column
            header="Day Salary"
            body={(rowData) =>
              rowData?.day_salary
                ? Number(rowData.day_salary).toLocaleString()
                : ""
            }
          />
          <Column
            header="Total Salary"
            body={(rowData) =>
              rowData?.day_salary && rowData?.days
                ? Number(rowData.day_salary * rowData.days).toLocaleString()
                : ""
            }
          />
          <Column
            header="Profit"
            body={(rowData) =>
              rowData?.day_salary && rowData?.day_cost
                ? (
                    Number(Number(rowData.days) * Number(rowData.day_cost)) -
                    Number(
                      Number(rowData.days) * Number(rowData.transportation)
                    ) -
                    Number(Number(rowData.day_salary) * Number(rowData.days))
                  ).toLocaleString()
                : ""
            }
          />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
}
