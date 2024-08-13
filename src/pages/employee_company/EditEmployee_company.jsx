import React, { useEffect, useState } from "react";
import Edit from "../../API/employee_company/Edit";
import AuthCheck from "../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetEmployee_company from "../../API/employee_company/GetEmployee_company";

export default function EditEmployee_company() {
  const [inputs, setInputs] = useState({
    employee_salary: "",
    date: "",
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const [employee_company, setEmployee_company] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  // Fetch admin data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const employee_companyData = await GetEmployee_company(
          id,
          setLoading,
          navigate
        );
        setEmployee_company(employee_companyData); // Set admin data in state
        // Update inputs with admin data
        if (employee_companyData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            employee_salary: employee_companyData.employee_salary || "",
            date: employee_companyData.date || "",
            id: id, // Assuming id is correctly defined from useParams
          }));
        }
      } catch (error) {
        console.error("Error fetching employee company:", error);
        // Handle error or display message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Edit(inputs, setLoading, navigate);
      console.log("employee company updated successfully:", inputs);
      // Optionally, you can navigate to another page or show a success message
    } catch (error) {
      console.error("Error updating employee company:", error);
      // Handle error or display message
    }
  };

  return (
    <form className="w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">
        Edit Employee company
      </h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="employee_salary" className="input-label">
            employee salary <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="employee_salary"
            type="number"
            className="input"
            name="employee_salary"
            onChange={handleChange}
            value={inputs.employee_salary}
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 mb-6">
        <label htmlFor="date" className="input-label">
          date <span className="text-red-500 text-sm">*</span>
        </label>
        <input
          id="date"
          type="month"
          // max={maxMonth}
          className="input"
          name="date"
          onChange={handleChange}
          value={inputs.date}
        />
      </div>
      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
      >
        edit Employee company
      </LaddaButton>
    </form>
  );
}
