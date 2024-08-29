import React, { useEffect, useState } from "react";
import Edit from "../../API/supply_chain/Edit";
import AuthCheck from "../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetSupply_chain from "../../API/supply_chain/GetSupply_chain";

export default function EditSupply_chain() {
  const [inputs, setInputs] = useState({
    po: "",
    pr: "",
    date: "",
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const [supply_chain, setSupply_chain] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  // Fetch supply_chain data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supply_chainData = await GetSupply_chain(
          id,
          setLoading,
          navigate
        );
        setSupply_chain(supply_chainData); // Set supply_chain data in state
        // Update inputs with supply_chain data
        if (supply_chainData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            po: supply_chainData.po || "",
            pr: supply_chainData.pr || "",
            date: supply_chainData.date || "",
            id: id, // Assuming id is correctly defined from useParams
          }));
        }
      } catch (error) {
        console.error("Error fetching Supply chain:", error);
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
      console.log("Supply chain updated successfully:", inputs);
      // Optionally, you can navigate to another page or show a success message
    } catch (error) {
      console.error("Error updating Supply chain:", error);
      // Handle error or display message
    }
  };

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">
        Edit Supply chain
      </h1>
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
        disabled={user?.data.role !== "admin"}
      >
        Edit Supply chain
      </LaddaButton>
    </form>
  );
}
