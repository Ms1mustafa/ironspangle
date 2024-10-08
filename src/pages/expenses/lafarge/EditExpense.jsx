import React, { useEffect, useState } from "react";
import Edit from "../../../API/expenses/lafarge/Edit";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetExpense from "../../../API/expenses/lafarge/GetExpenses";

export default function EditLafargeExpense() {
  const [inputs, setInputs] = useState({
    item: "",
    cost: "",
    date: "",
    remark: "",
    expense_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  // Fetch Expense data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const expenseData = await GetExpense(id, setLoading, navigate);
        setExpense(expenseData); // Set Expense data in state
        // Update inputs with Expense data
        if (expenseData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            item: expenseData.item || "",
            cost: expenseData.cost || "",
            date: expenseData.date || "",
            remark: expenseData.remark || "",
            expense_id: id, // Assuming id is correctly defined from useParams
          }));
        }
      } catch (error) {
        console.error("Error fetching expense:", error);
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
      console.log("Expense updated successfully:", inputs);
      // Optionally, you can navigate to another page or show a success message
    } catch (error) {
      console.error("Error updating Expense:", error);
      // Handle error or display message
    }
  };

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">
        Edit Lafarge Expense
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
            value={inputs.item}
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
            value={inputs.cost}
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
            value={inputs.date}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="remark" className="input-label">
            remark <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="remark"
            type="number"
            className="input"
            name="remark"
            onChange={handleChange}
            value={inputs.remark}
          />
        </div>
      </div>
      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
        type="submit"
        disabled={user?.data.role !== "admin"}
      >
        Update Expense
      </LaddaButton>
    </form>
  );
}
