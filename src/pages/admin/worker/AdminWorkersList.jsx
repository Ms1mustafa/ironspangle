import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink, useParams } from "react-router-dom";
import AuthCheck from "../../../API/account/AuthCheck";
import Button from "../../../components/Button";
import SweetAlert from "../../../components/SweetAlert";
import Delete from "../../../API/admin/worker/Delete";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

export default function AdminWorkersList() {
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
        }/admin/worker/list.php?admin_id=${id}`
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
                to={`/admin/${id}/workers/${rowData.id}/edit`}
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
        const { salary, active_days } = worker;
        return total + Number(salary * active_days);
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalContractSalary = () => {
    return workers
      .reduce((total, worker) => {
        const { contract_salary, active_days } = worker;
        return total + Number(contract_salary * active_days);
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
  const calculateOverallTotalRewards = () => {
    return workers
      .reduce((total, worker) => {
        const { rewards } = worker;
        return total + Number(rewards);
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
  const calculateOverallTotalReceived = () => {
    return workers
      .reduce((total, { salary = 0, insurance2 = 0, active_days = 0 }) => {
        return (
          total + (Number(salary) * Number(active_days) - Number(insurance2))
        );
      }, 0)
      .toLocaleString();
  };

  const calculateOverallTotalPRTotal = () => {
    return workers
      .reduce((total, worker) => {
        const { pr_days, pr_cost, rewards } = worker;
        return total + Number(pr_days) * Number(pr_cost) + Number(rewards);
      }, 0)
      .toLocaleString();
  };

  const footerGroup = workers.length > 0 && (
    <ColumnGroup>
      <Row>
        <Column colSpan={5} />
        <Column
          footer={calculateOverallTotalSalary}
          footerStyle={{
            // textAlign: "center",
            color: "#ff8e29",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalContractSalary}
          footerStyle={{
            // textAlign: "center",
            color: "#ff8e29",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalTransportation}
          footerStyle={{
            // textAlign: "center",
            color: "#ff8e29",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalInsurance}
          footerStyle={{
            // textAlign: "center",
            color: "#ff8e29",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalPPE}
          footerStyle={{
            // textAlign: "center",
            color: "#ff8e29",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalRewards}
          footerStyle={{
            // textAlign: "center",
            color: "#ff8e29",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalInsurance2}
          footerStyle={{
            // textAlign: "center",
            color: "#ff8e29",
            fontWeight: "bold",
          }}
        />
        <Column
          footer={calculateOverallTotalReceived}
          footerStyle={{
            // textAlign: "center",
            color: "#ff8e29",
            fontWeight: "bold",
          }}
        />
        <Column colSpan={2} />
        <Column
          footer={calculateOverallTotalPRTotal}
          footerStyle={{
            // textAlign: "center",
            color: "#ff8e29",
            fontWeight: "bold",
          }}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="w-full py-8 flex flex-col">
      <NavLink
        to={`/admin/${id}/workers/create`}
        className="button mb-4 self-end"
        disabled={user?.data.role !== "admin"}
      >
        Create Worker
      </NavLink>
      <div className="card w-[70rem]">
        <DataTable
          value={workers}
          paginator
          rows={5}
          showGridlines
          footerColumnGroup={footerGroup}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No Workers found."
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
            fontSize: "14px",
            backgroundColor: "white",
          }}
        >
          <Column
            field="name"
            header="Name"
            style={{ width: "auto", whiteSpace: "nowrap" }}
          />
          <Column field="job" header="Job" />
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
            field="salary"
            header="Salary"
            body={(rowData) =>
              rowData?.salary ? Number(rowData.salary).toLocaleString() : ""
            }
          />
          <Column
            header="Total Salary"
            body={(rowData) =>
              rowData?.salary && rowData?.active_days
                ? Number(rowData.salary * rowData.active_days).toLocaleString()
                : ""
            }
          />

          <Column
            header="Contract salary"
            body={(rowData) =>
              rowData?.contract_salary && rowData?.active_days
                ? Number(
                    rowData.contract_salary * rowData.active_days
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
            body={(rowData) =>
              rowData?.insurance || 0
                ? Number(rowData.insurance).toLocaleString()
                : ""
            }
          />
          <Column header="PPE" field="ppe" />
          <Column
            header="Rewards"
            body={(rowData) =>
              rowData?.rewards ? Number(rowData.rewards).toLocaleString() : ""
            }
          />
          <Column
            header="Insurance"
            body={(rowData) =>
              rowData?.insurance2
                ? Number(rowData.insurance2).toLocaleString()
                : ""
            }
          />
          <Column
            header="Received"
            body={(rowData) => {
              const salary = Number(rowData?.salary) || 0;
              const activeDays = Number(rowData?.active_days) || 0;
              const insurance2 = Number(rowData?.insurance2) || 0;
              const rewards = Number(rowData?.rewards) || 0;

              return salary && activeDays
                ? (salary * activeDays - insurance2 + rewards).toLocaleString()
                : "";
            }}
          />
          <Column
            header="PR Days"
            body={(rowData) =>
              rowData?.pr_days ? Number(rowData.pr_days).toLocaleString() : ""
            }
          />
          <Column
            header="PR Cost"
            body={(rowData) =>
              rowData?.pr_cost ? Number(rowData.pr_cost).toLocaleString() : ""
            }
          />
          <Column
            header="PR Total"
            body={(rowData) =>
              rowData?.pr_days && rowData?.pr_cost
                ? (
                    Number(rowData.pr_days) * Number(rowData.pr_cost) +
                    Number(rowData.rewards)
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
