import { useEffect, useState } from "react";
import Create from "../../API/swift/Create";
import AuthCheck from "../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
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
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Create Swift</h1>
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
        disabled={user?.data.role !== "admin"}
      >
        Create Swift
      </LaddaButton>
    </form>
  );
}
