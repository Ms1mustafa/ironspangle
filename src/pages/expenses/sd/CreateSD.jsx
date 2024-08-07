import { useEffect, useState } from "react";
import Create from "../../../API/expenses/sd/Create";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = AuthCheck();

  //add user name to inputs
  useEffect(() => {
    setInputs((values) => ({ ...values, created_by: user?.data.name }));
  }, [user]);

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
    <form className="w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Create SD</h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="name" className="input-label">
            SD Name <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="name"
            className="input"
            name="name"
            onChange={handleChange}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="budget" className="input-label">
            PO cost
          </label>
          <input
            id="budget"
            type="number"
            className="input"
            name="budget"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="isg" className="input-label">
            isg
          </label>
          <input
            id="isg"
            type="number"
            className="input"
            name="isg"
            onChange={handleChange}
          />
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
          />
        </div>
      </div>
      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
      >
        Create SD
      </LaddaButton>
    </form>
  );
}
