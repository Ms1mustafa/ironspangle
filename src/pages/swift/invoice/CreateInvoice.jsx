import { useEffect, useState } from "react";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetSwift from "../../../API/swift/GetSwift";
import CreateInvoice from "../../../API/swift/invoice/CreateInvoice";

export default function CreateNewInvoice() {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [swift, setSwift] = useState(null);
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const invoiceData = await GetSwift(id, setLoading, navigate); // Await GetSwift promise
        setSwift(invoiceData); // Set invoice data in state
      } catch (error) {
        // toast.error(error.message); // Display specific error message using toast
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    setInputs((values) => ({ ...values, swift_id: id }));
  }, [id, navigate]); // Fetch data whenever id changes

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setInputs((values) => ({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  function handleSubmit(e) {
    e.preventDefault();
  }

  function Create() {
    CreateInvoice(inputs, setLoading, navigate);
  }

  function CreateAnother() {
    CreateInvoice(inputs, setLoading);
    //empty inputs
    setInputs({ invoice_id: id });
  }

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Create invoice</h1>
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
            value={inputs.description || ""}
          />
          <p className="text-gray-600 text-xs italic"></p>
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
            invoice send
          </label>
          <input
            id="invoice_send"
            type="checkbox"
            className=""
            name="invoice_send"
            onChange={handleChange}
          />
        </div>
        <div className="px-3">
          <label htmlFor="invoice_store" className="mr-2">
            invoice store
          </label>
          <input
            id="invoice_store"
            type="checkbox"
            className=""
            name="invoice_store"
            onChange={handleChange}
          />
        </div>
        <div className="px-3 mb-6 md:mb-0">
          <label htmlFor="invoice_pru" className="mr-2">
            invoice pru
          </label>
          <input
            id="invoice_pru"
            type="checkbox"
            className=""
            name="invoice_pru"
            onChange={handleChange}
          />
        </div>
        <div className="px-3">
          <label htmlFor="invoice_accounting" className="mr-2">
            invoice accounting
          </label>
          <input
            id="invoice_accounting"
            type="checkbox"
            className=""
            name="invoice_accounting"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="s_no" className="input-label">
            s no
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
            s date
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
            cost <span className="text-red-500 text-sm">*</span>
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
            status <span className="text-red-500 text-sm">*</span>
          </label>
          <select
            name="status"
            onChange={handleChange}
            value={inputs.status || "in progress"}
            className="input"
            defaultValue={"in progress"}
          >
            <option value="in progress" selected>
              in progress
            </option>
            <option value="recived in bank">recived in bank</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="p_and_lc" className="input-label">
            P&LC
          </label>
          <select
            name="status"
            onChange={handleChange}
            value={inputs.status || "LC"}
            className="input"
            defaultValue={"LC"}
          >
            <option value="LC" selected>
              LC
            </option>
            <option value="P">P</option>
          </select>
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>

      <div className="flex flex-wrap gap-5 -mx-3 mb-6">
        <LaddaButton
          className="button"
          data-style={EXPAND_LEFT}
          loading={loading}
          onClick={Create}
        >
          Create
        </LaddaButton>
        <LaddaButton
          className="button bg-transparent text-main hover:bg-main hover:text-white"
          data-style={EXPAND_LEFT}
          loading={loading}
          onClick={CreateAnother}
        >
          Create & add another
        </LaddaButton>
      </div>
    </form>
  );
}
