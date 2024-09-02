import React, { useEffect, useState } from "react";
import Edit from "../../../API/swift/invoice/Edit";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetInvoice from "../../../API/swift/invoice/GetInvoice";

export default function EditInvoice() {
  const [inputs, setInputs] = useState({
    description: "",
    status: "in progress",
    invoice_id: "",
    pr_no: "",
    pr_date: "",
    po_no: "",
    po_date: "",
    invoice_no: "",
    invoice_date: "",
    invoice_send: false,
    invoice_store: false,
    invoice_pru: false,
    invoice_accounting: false,
    s_no: "",
    s_date: "",
    cost: "",
    p_and_lc: "LC",
  });
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id, invoice_id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const invoiceData = await GetInvoice(
          { invoice_id: invoice_id, id: id },
          setLoading,
          navigate
        );
        setInvoice(invoiceData); // Set invoice data in state
        if (invoiceData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            description: invoiceData.description || "",
            status: invoiceData.status || "",
            pr_no: invoiceData.pr_no || "",
            pr_date: invoiceData.pr_date || "",
            po_no: invoiceData.po_no || "",
            po_date: invoiceData.po_date || "",
            invoice_no: invoiceData.invoice_no || "",
            invoice_date: invoiceData.invoice_date || "",
            invoice_send: invoiceData.invoice_send || false,
            invoice_store: invoiceData.invoice_store || false,
            invoice_pru: invoiceData.invoice_pru || false,
            invoice_accounting: invoiceData.invoice_accounting || false,
            s_no: invoiceData.s_no || "",
            s_date: invoiceData.s_date || "",
            cost: invoiceData.cost || "",
            p_and_lc: invoiceData.p_and_lc || "LC",
            swift_id: id,
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
  }, [id, invoice_id, navigate]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Edit(inputs, setLoading, navigate);
      console.log("Invoice updated successfully:", inputs);
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Edit Invoice</h1>

      {/* Existing fields */}
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="description" className="input-label">
            Description <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="description"
            className="input"
            name="description"
            onChange={handleChange}
            value={inputs.description || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="pr_no" className="input-label">
            PR NO
          </label>
          <input
            id="pr_no"
            type="number"
            className="input"
            name="pr_no"
            onChange={handleChange}
            value={inputs.pr_no || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="pr_date" className="input-label">
            PR Date
          </label>
          <input
            id="pr_date"
            type="date"
            className="input"
            name="pr_date"
            onChange={handleChange}
            value={inputs.pr_date || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="po_no" className="input-label">
            PO NO
          </label>
          <input
            id="po_no"
            type="number"
            className="input"
            name="po_no"
            onChange={handleChange}
            value={inputs.po_no || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="po_date" className="input-label">
            PO Date
          </label>
          <input
            id="po_date"
            type="date"
            className="input"
            name="po_date"
            onChange={handleChange}
            value={inputs.po_date || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="invoice_no" className="input-label">
            Invoice NO <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="invoice_no"
            type="number"
            className="input"
            name="invoice_no"
            onChange={handleChange}
            value={inputs.invoice_no || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="invoice_date" className="input-label">
            Invoice Date <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="invoice_date"
            type="date"
            className="input"
            name="invoice_date"
            onChange={handleChange}
            value={inputs.invoice_date || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="px-3 mb-6 md:mb-0">
          <label htmlFor="invoice_send" className="mr-2">
            Invoice send
          </label>
          <input
            id="invoice_send"
            type="checkbox"
            className=""
            name="invoice_send"
            onChange={handleChange}
            checked={inputs.invoice_send == 1 || false}
          />
        </div>
        <div className="px-3">
          <label htmlFor="invoice_store" className="mr-2">
            Invoice store
          </label>
          <input
            id="invoice_store"
            type="checkbox"
            className=""
            name="invoice_store"
            onChange={handleChange}
            checked={inputs.invoice_store == 1 || false}
          />
        </div>
        <div className="px-3 mb-6 md:mb-0">
          <label htmlFor="invoice_pru" className="mr-2">
            Invoice pru
          </label>
          <input
            id="invoice_pru"
            type="checkbox"
            className=""
            name="invoice_pru"
            onChange={handleChange}
            checked={inputs.invoice_pru == 1 || false}
          />
        </div>
        <div className="px-3">
          <label htmlFor="invoice_accounting" className="mr-2">
            Invoice accounting
          </label>
          <input
            id="invoice_accounting"
            type="checkbox"
            className=""
            name="invoice_accounting"
            onChange={handleChange}
            checked={inputs.invoice_accounting == 1 || false}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="s_no" className="input-label">
            S no
          </label>
          <input
            id="s_no"
            type="number"
            className="input"
            name="s_no"
            onChange={handleChange}
            value={inputs.s_no || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="s_date" className="input-label">
            S date
          </label>
          <input
            id="s_date"
            type="date"
            className="input"
            name="s_date"
            onChange={handleChange}
            value={inputs.s_date || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="cost" className="input-label">
            Cost <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="cost"
            type="number"
            className="input"
            name="cost"
            onChange={handleChange}
            value={inputs.cost || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="status" className="input-label">
            Status <span className="text-red-500 text-sm">*</span>
          </label>
          <select
            name="status"
            onChange={handleChange}
            value={inputs.status || "in progress"}
            className="input"
          >
            <option value="in progress">In progress</option>
            <option value="received in bank">Received in bank</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="p_and_lc" className="input-label">
            P&LC
          </label>
          <select
            name="p_and_lc"
            onChange={handleChange}
            value={inputs.p_and_lc || "LC"}
            className="input"
          >
            <option value="LC">LC</option>
            <option value="P">P</option>
          </select>
        </div>
      </div>

      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
        type="submit"
        disabled={user?.data.role !== "admin"}
      >
        Update Invoice
      </LaddaButton>
    </form>
  );
}
