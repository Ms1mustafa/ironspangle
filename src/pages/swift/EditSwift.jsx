import React, { useEffect, useState } from "react";
import Edit from "../../API/swift/Edit";
import AuthCheck from "../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetSwift from "../../API/swift/GetSwift";

export default function EditSwift() {
  const [inputs, setInputs] = useState({
    swift: "",
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const [swift, setSwift] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  // Fetch po data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const swiftData = await GetSwift(id, setLoading, navigate);
        setSwift(swiftData); // Set po data in state
        // Update inputs with po data
        if (swiftData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            swift: swiftData.swift || "",
            id: id, // Assuming id is correctly defined from useParams
          }));
        }
      } catch (error) {
        console.error("Error fetching swift:", error);
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
      console.log("swift updated successfully:", inputs);
      // Optionally, you can navigate to another page or show a success message
    } catch (error) {
      console.error("Error updating swift:", error);
      // Handle error or display message
    }
  };

  return (
    <form className="w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Edit Swift</h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="swift" className="input-label">
            swift <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="swift"
            className="input"
            name="swift"
            onChange={handleChange}
            value={inputs.swift}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="date" className="input-label">
            date
          </label>
          <input
            id="date"
            type="date"
            className="input"
            name="date"
            onChange={handleChange}
            value={inputs.date || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="receive_at_bank" className="input-label">
            receive at bank
          </label>
          <input
            id="receive_at_bank"
            type="date"
            className="input"
            name="receive_at_bank"
            onChange={handleChange}
            value={inputs.receive_at_bank || ""}
          />
        </div>
      </div>

      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
        type="submit"
      >
        Update Swift
      </LaddaButton>
    </form>
  );
}
