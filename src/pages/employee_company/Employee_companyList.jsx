import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import AuthCheck from "../../API/account/AuthCheck";
import Button from "../../components/Button";
import SweetAlert from "../../components/SweetAlert";
import Delete from "../../API/employee_company/Delete";

export default function Employee_companyList() {
  const user = AuthCheck();

  const [employee_company, setEmployee_company] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));

  async function getEmployee_company() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/employee_company/list.php?date=${date}`
      );
      setEmployee_company(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Employee company:", error);
      toast.error("Failed to fetch Employee company.");
      setLoading(false);
    }
  }

  useEffect(() => {
    getEmployee_company();
  }, [date]);

  const refreshEmployee_company = () => {
    getEmployee_company(); // Function to refresh employee_company list
  };

  const actionTemplate = (employee_company) => {
    return (
      <div className="flex gap-2">
        <NavLink
          to={`/employee_company/${employee_company.id}/edit`}
          className="button"
        >
          Edit
        </NavLink>
        <Button
          to={`/employee_company/${employee_company.id}/items`}
          className="button bg-red-500 hover:bg-red-600"
          onClick={() =>
            SweetAlert({
              props: {
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                onConfirm: () => {
                  Delete(
                    employee_company.id,
                    setLoading,
                    refreshEmployee_company
                  );
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

  return (
    <div className="w-full p-8 flex flex-col">
      <div className="place-content-between flex flex-wrap gap-4">
        <input
          type="month"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input w-fit mb-4 self-start"
        />
        <NavLink
          to="/employee_company/create"
          className="button mb-4 self-end"
          disabled={user?.data.role !== "employee_company"}
        >
          Create Employee company
        </NavLink>
      </div>
      <div className="card">
        <DataTable
          value={employee_company}
          showGridlines
          emptyMessage="No Employee company found."
          loading={loading}
          tableStyle={{
            minWidth: "50rem",
          }}
        >
          <Column
            header="Employee salary"
            body={(rowData) =>
              rowData?.employee_salary
                ? Number(rowData.employee_salary).toLocaleString()
                : ""
            }
          ></Column>
          <Column field="date" header="Date"></Column>
          <Column header="Actions" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
