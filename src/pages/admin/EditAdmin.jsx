import React, { useEffect, useState } from "react";
import Edit from "../../API/admin/Edit";
import AuthCheck from "../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetAdmin from "../../API/admin/GetAdmin";

export default function CreateUser() {
  const [inputs, setInputs] = useState({
    po: "",
    pr: "",
    date: "",
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  // Fetch admin data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adminData = await GetAdmin(id, setLoading, navigate);
        setAdmin(adminData); // Set admin data in state
        // Update inputs with admin data
        if (adminData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            po: adminData.po || "",
            pr: adminData.pr || "",
            date: adminData.date || "",
            id: id, // Assuming id is correctly defined from useParams
          }));
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
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
      console.log("admin updated successfully:", inputs);
      // Optionally, you can navigate to another page or show a success message
    } catch (error) {
      console.error("Error updating admin:", error);
      // Handle error or display message
    }
  };

  return (
    <form className="w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Create Admin</h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="po" className="input-label">
            PO <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="po"
            type="number"
            className="input"
            name="po"
            onChange={handleChange}
            value={inputs.po}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="pr" className="input-label">
            PR <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="pr"
            type="number"
            className="input"
            name="pr"
            onChange={handleChange}
            value={inputs.pr}
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
        edit admin
      </LaddaButton>
    </form>
  );
}
