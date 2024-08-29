import React, { useEffect, useState } from "react";
import Copy from "../../API/mec/Copy";
import AuthCheck from "../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetMec from "../../API/mec/GetMec";

export default function CopyMec() {
  const [inputs, setInputs] = useState({
    fixed_invoice_cost: "",
    po: "",
    pr: "",
    date: "",
    mec_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [mec, setMec] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  // Fetch mec data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mecData = await GetMec(id, setLoading, navigate);
        setMec(mecData); // Set mec data in state
        // Update inputs with mec data
        if (mecData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            fixed_invoice_cost: mecData.fixed_invoice_cost || "",
            po: mecData.po || "",
            pr: mecData.pr || "",
            date: mecData.date || "",
            mec_id: id, // Assuming id is correctly defined from useParams
          }));
        }
      } catch (error) {
        console.error("Error fetching mec:", error);
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
      await Copy(inputs, setLoading, navigate);
      console.log("mec copied successfully:", inputs);
      // Optionally, you can navigate to another page or show a success message
    } catch (error) {
      console.error("Error copying mec:", error);
      // Handle error or display message
    }
  };

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Copy MEC</h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="fixed_invoice_cost" className="input-label">
            Fixed Invoice Cost <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="fixed_invoice_cost"
            className="input"
            type="number"
            name="fixed_invoice_cost"
            onChange={handleChange}
            value={inputs.fixed_invoice_cost}
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
          // value={inputs.date}
        />
      </div>
      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
        disabled={user?.data.role !== "admin"}
      >
        Copy MEC
      </LaddaButton>
    </form>
  );
}
