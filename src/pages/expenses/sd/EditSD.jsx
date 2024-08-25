import React, { useEffect, useState } from "react";
import Edit from "../../../API/expenses/sd/Edit";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetSD from "../../../API/expenses/sd/GetSD";

export default function CreateUser() {
  const [inputs, setInputs] = useState({
    name: "",
    budget: "",
    isg: "",
    po: "",
    pr: "",
    sd_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [sd, setSD] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  // Fetch sd data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sdData = await GetSD(id, setLoading, navigate);
        setSD(sdData); // Set sd data in state
        // Update inputs with sd data
        if (sdData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            name: sdData.name || "",
            body: sdData.body || "",
            budget: sdData.budget || "",
            isg: sdData.isg || "",
            po: sdData.po || "",
            pr: sdData.pr || "",
            sd_id: id, // Assuming id is correctly defined from useParams
          }));
        }
      } catch (error) {
        console.error("Error fetching sd:", error);
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
      console.log("sd updated successfully:", inputs);
      // Optionally, you can navigate to another page or show a success message
    } catch (error) {
      console.error("Error updating sd:", error);
      // Handle error or display message
    }
  };

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Edit sd</h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="sd-name" className="input-label">
            sd Name <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="sd-name"
            className="input"
            name="name"
            onChange={handleChange}
            value={inputs.name}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="budget" className="input-label">
            PO cost <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="budget"
            type="number"
            className="input"
            name="budget"
            onChange={handleChange}
            value={inputs.budget}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="isg" className="input-label">
            ISG <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="isg"
            type="number"
            className="input"
            name="isg"
            onChange={handleChange}
            value={inputs.isg}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
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
      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
        type="submit"
      >
        Update sd
      </LaddaButton>
    </form>
  );
}
