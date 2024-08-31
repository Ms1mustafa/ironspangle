import { useEffect, useState } from "react";
import Create from "../../API/po/Create";
import AuthCheck from "../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
  const [inputs, setInputs] = useState({ status: "pending" });
  const [loading, setLoading] = useState(false);
  const user = AuthCheck();
  const navigate = useNavigate();

  //add user name to inputs
  useEffect(() => {
    setInputs((values) => ({ ...values }));
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    Create(inputs, setLoading, navigate);
    console.log(inputs);
  }

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Create PO</h1>
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
            defaultValue={"pending"}
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
          />
        </div>
      </div>
      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
        disabled={user?.data.role !== "admin"}
      >
        Create Project
      </LaddaButton>
    </form>
  );
}
