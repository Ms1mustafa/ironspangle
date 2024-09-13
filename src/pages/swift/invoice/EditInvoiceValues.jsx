import React, { useEffect, useState } from "react";
import AssignInvoice from "../../../API/swift/AssignInvoice";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetInvoice from "../../../API/swift/invoice/GetInvoice";
import toast from "react-hot-toast";
import Edit from "../../../API/swift/invoice/Edit";

export default function EditInvoiceValues() {
  const [inputs, setInputs] = useState({
    id: "",
    guarantee: false,
    tax: false,
    publish: "",
    fines: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const user = AuthCheck();
  const { invoice_id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const invoiceData = await GetInvoice(
          { invoice_id: invoice_id },
          setLoading,
          navigate
        );
        setInvoice(invoiceData); // Set invoice data in state
        if (invoiceData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            guarantee: invoiceData.guarantee > 0 || false,
            tax: invoiceData.tax > 0 || false,
            publish: invoiceData.publish || "",
            fines: invoiceData.fines || "",
            cost: invoiceData.cost || "",
            invoice_no: invoiceData.invoice_no || "",
            id: invoice_id,
          }));
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [invoice_id, navigate]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !inputs.guarantee &&
      !inputs.tax &&
      (!inputs.publish || inputs.publish === "0") &&
      (!inputs.fines || inputs.fines === "0")
    ) {
      toast.error("Please fill at least one field to update.");
      return;
    }
    try {
      await Edit(inputs, setLoading, navigate);
      console.log("Invoice updated successfully:", inputs);
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Assign Invoice</h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <div className="px-3 mb-6 md:mb-0">
            <label htmlFor="guarantee" className="mr-2">
              Guarantee 5%
            </label>
            <input
              id="guarantee"
              type="checkbox"
              name="guarantee"
              onChange={handleChange}
              checked={inputs.guarantee}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <p className="input-label">
            {inputs.guarantee ? inputs.cost * 0.05 : ""}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <div className="px-3 mb-6 md:mb-0">
            <label htmlFor="tax" className="mr-2">
              Tax 3%
            </label>
            <input
              id="tax"
              type="checkbox"
              name="tax"
              onChange={handleChange}
              checked={inputs.tax}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <p htmlFor="tax" className="input-label">
            {inputs.tax ? inputs.cost * 0.03 : ""}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="publish" className="input-label">
            publish
          </label>
          <input
            id="publish"
            type="number"
            className="input"
            name="publish"
            onChange={handleChange}
            value={inputs.publish}
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="fines" className="input-label">
            fines
          </label>
          <input
            id="fines"
            type="number"
            className="input"
            name="fines"
            onChange={handleChange}
            value={inputs.fines}
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
        Edit Values
      </LaddaButton>
    </form>
  );
}
