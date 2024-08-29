import React, { useEffect, useState } from "react";
import Edit from "../../API/po/Edit";
import AuthCheck from "../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetPO from "../../API/po/GetPO";

export default function EditPO() {
  const [inputs, setInputs] = useState({
    description: "",
    no_pr: "",
    no_po: "",
    status: "",
    price: "",
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const [po, setPO] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  // Fetch po data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const poData = await GetPO(id, setLoading, navigate);
        setPO(poData); // Set po data in state
        // Update inputs with po data
        if (poData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            description: poData.description || "",
            no_pr: poData.no_pr || "",
            no_po: poData.no_po || "",
            status: poData.status || "",
            price: poData.price || "",
            id: id, // Assuming id is correctly defined from useParams
          }));
        }
      } catch (error) {
        console.error("Error fetching po:", error);
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
      console.log("po updated successfully:", inputs);
      // Optionally, you can navigate to another page or show a success message
    } catch (error) {
      console.error("Error updating po:", error);
      // Handle error or display message
    }
  };

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Edit PO</h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="description" className="input-label">
            description <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="description"
            className="input"
            name="description"
            onChange={handleChange}
            value={inputs.description}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="no_pr" className="input-label">
            no pr
          </label>
          <input
            id="no_pr"
            type="number"
            className="input"
            name="no_pr"
            onChange={handleChange}
            value={inputs.no_pr}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="no_po" className="input-label">
            no po
          </label>
          <input
            id="no_po"
            type="number"
            className="input"
            name="no_po"
            onChange={handleChange}
            value={inputs.no_po}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="status" className="input-label">
            status <span className="text-red-500 text-sm">*</span>
          </label>
          <select
            name="status"
            onChange={handleChange}
            value={inputs.status || "pending"}
            className="input"
          >
            <option value="pending" selected>
              pending
            </option>
            <option value="in process">in process</option>
            <option value="done">done</option>
          </select>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="price" className="input-label">
            price <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="price"
            type="number"
            className="input"
            name="price"
            onChange={handleChange}
            value={inputs.price}
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
        Update PO
      </LaddaButton>
    </form>
  );
}
