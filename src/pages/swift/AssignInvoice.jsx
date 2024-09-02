import React, { useEffect, useState } from "react";
import AssignInvoice from "../../API/swift/AssignInvoice";
import AuthCheck from "../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AutoComplete } from "primereact/autocomplete";
import toast from "react-hot-toast";

export default function EditSwiftInvoice() {
  const [inputs, setInputs] = useState({
    swift_id: "",
    id: "",
    guarantee: false,
    tax: false,
    publish: "",
    fines: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const user = AuthCheck();
  const { id } = useParams();

  // Fetch invoices data on component mount
  const getInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/invoice/list.php`
      );
      setInvoices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvoices();
    setInputs((prevInputs) => ({
      ...prevInputs,
      swift_id: id,
    }));
  }, [id]);

  // Search suggestions based on input
  const searchSuggestion = (event) => {
    let query = event.query.toLowerCase();
    let filteredSuggestions = invoices.filter((invoice) =>
      invoice.description.toLowerCase().includes(query)
    );
    console.log(filteredSuggestions);
    setSuggestions(filteredSuggestions);
  };

  // Handle suggestion selection
  const handleSelect = (e) => {
    const selectedItem = e.value;
    if (selectedItem) {
      // Update form inputs based on selected suggestion
      setInputs((prevInputs) => ({
        ...prevInputs,
        id: selectedItem.id,
      }));
      setSelectedInvoice(selectedItem);
      setValue(selectedItem.description); // Update AutoComplete value to selected description
    }
  };

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
    try {
      await AssignInvoice(inputs, setLoading, navigate);
      // toast.success("Invoice assigned successfully!");
    } catch (error) {
      toast.error("Failed to assign invoice.");
    }
    console.log(inputs);
    console.log(selectedInvoice);
  };

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Assign Invoice</h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="description" className="input-label">
            Invoice <span className="text-red-500 text-sm">*</span>
          </label>
          <AutoComplete
            value={value}
            suggestions={suggestions}
            completeMethod={searchSuggestion}
            onChange={(e) => setValue(e.value)}
            onSelect={handleSelect}
            field="description" // Ensure this matches the property in suggestions
            placeholder="Search..."
          />
        </div>
      </div>

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
              //   checked={inputs.guarantee}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <p className="input-label">
            {inputs.guarantee ? selectedInvoice.cost * 0.05 : ""}
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
              //   checked={inputs.tax}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <p htmlFor="tax" className="input-label">
            {inputs.tax ? selectedInvoice.cost * 0.03 : ""}
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
        Assign Invoice
      </LaddaButton>
    </form>
  );
}
