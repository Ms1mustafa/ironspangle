import React, { useEffect, useState } from "react";
import Edit from "../../../API/project/item/Edit";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetItem from "../../../API/project/item/GetItem";

export default function CreateUser() {
  const [inputs, setInputs] = useState({
    name: "",
    unit: "",
    qty: "",
    unit_price: "",
    trans: "",
    remarks: "",
    date: "",
    project_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [Item, setItem] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { projectId, itemId } = useParams();

  // Fetch project data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const itemData = await GetItem(
          { itemId: itemId, projectId: projectId },
          setLoading,
          navigate
        );
        setItem(itemData); // Set project data in state
        // Update inputs with project data
        if (itemData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            name: itemData.name || "",
            unit: itemData.unit || "",
            qty: itemData.qty || "",
            unit_price: itemData.unit_price || "",
            trans: itemData.trans || "",
            remarks: itemData.remarks || "",
            date: itemData.date || "",
            project_id: projectId, // Assuming id is correctly defined from useParams
            item_id: itemId,
          }));
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        // Handle error or display message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, itemId, navigate]);

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
      console.log("Project updated successfully:", inputs);
      // Optionally, you can navigate to another page or show a success message
    } catch (error) {
      console.error("Error updating project:", error);
      // Handle error or display message
    }
  };

  return (
    <form className="w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Edit Item</h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="item-name" className="input-label">
            Item Name <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="item-name"
            className="input"
            name="name"
            onChange={handleChange}
            value={inputs.name}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>

      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="unit" className="input-label">
            Unit <span className="text-red-500 text-sm">*</span>
          </label>
          <select
            name="unit"
            onChange={handleChange}
            value={inputs.unit}
            className="input"
          >
            <option value="LS">LS</option>
            <option value="EA">EA</option>
            <option value="Set">Set</option>
          </select>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="qty" className="input-label">
            QTY <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="qty"
            type="number"
            className="input"
            name="qty"
            onChange={handleChange}
            value={inputs.qty}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="unit-price" className="input-label">
            Unit Price <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="unit-price"
            type="number"
            className="input"
            name="unit_price"
            onChange={handleChange}
            value={inputs.unit_price}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="trans" className="input-label">
            Trans <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="trans"
            type="number"
            className="input"
            name="trans"
            onChange={handleChange}
            value={inputs.trans}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="remarks" className="input-label">
            Remarks <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="remarks"
            className="input"
            name="remarks"
            onChange={handleChange}
            value={inputs.remarks}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="date" className="input-label">
            Date <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="date"
            type="date"
            className="input"
            name="date"
            onChange={handleChange}
            value={inputs.date}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
        type="submit"
      >
        Update Item
      </LaddaButton>
    </form>
  );
}
