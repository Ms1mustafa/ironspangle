import { useEffect, useState } from "react";
import Create from "../../../API/expenses/lafarge/Create";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate } from "react-router-dom";

export default function CreateLafargeExpense() {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = AuthCheck();

  //add user name to inputs
  useEffect(() => {
    setInputs((values) => ({ ...values, created_by: user?.data.name }));
  }, [user]);

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
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">
        Create Lafarge Expense
      </h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="item-name" className="input-label">
            Item Name <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="item-name"
            className="input"
            name="item"
            onChange={handleChange}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="cost" className="input-label">
            cost
          </label>
          <input
            id="cost"
            className="input"
            name="cost"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="date" className="input-label">
            date <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="date"
            type="month"
            className="input"
            name="date"
            onChange={handleChange}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="remark" className="input-label">
            remark
          </label>
          <input
            id="remark"
            type="number"
            className="input"
            name="remark"
            onChange={handleChange}
          />
        </div>
      </div>
      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
        disabled={user?.data.role !== "admin"}
      >
        Create Expense
      </LaddaButton>
    </form>
  );
}
