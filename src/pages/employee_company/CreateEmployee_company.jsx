import { useEffect, useState } from "react";
import Create from "../../API/employee_company/Create";
import AuthCheck from "../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate } from "react-router-dom";

export default function CreateEmployee_company() {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = AuthCheck();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    Create(inputs, setLoading, navigate);
    console.log(inputs);
  }

  return (
    <form className="w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">
        Create Employee company
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
        />
      </div>
      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
      >
        Create Employee company
      </LaddaButton>
    </form>
  );
}
