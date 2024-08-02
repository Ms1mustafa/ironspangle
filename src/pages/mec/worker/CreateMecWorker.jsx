import { useEffect, useState } from "react";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetMec from "../../../API/mec/GetMec";
import CreateWorker from "../../../API/mec/worker/CreateWorker";

export default function CreateMecWorker() {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [mec, setMec] = useState(null);
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mecData = await GetMec(id, setLoading, navigate); // Await GetMec promise
        setMec(mecData); // Set mec data in state
      } catch (error) {
        // toast.error(error.message); // Display specific error message using toast
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    setInputs((values) => ({ ...values, mec_id: id }));
  }, [id, navigate]); // Fetch data whenever id changes

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
  }

  function Create() {
    CreateWorker(inputs, setLoading, navigate);
  }

  function CreateAnother() {
    CreateWorker(inputs, setLoading);
    //empty inputs
    setInputs({ mec_id: id, created_by: user?.data.name });
  }

  return (
    <form className="w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">
        Create MEC Worker
      </h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="name" className="input-label">
            Name <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="name"
            className="input"
            name="name"
            onChange={handleChange}
            value={inputs.name || ""}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="status" className="input-label">
            status <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="status"
            className="input"
            name="status"
            onChange={handleChange}
            value={inputs.status || ""}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="contract_days" className="input-label">
            contract days <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="contract_days"
            className="input"
            name="contract_days"
            onChange={handleChange}
            value={inputs.contract_days || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="active_days" className="input-label">
            active days <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="active_days"
            type="number"
            className="input"
            name="active_days"
            onChange={handleChange}
            value={inputs.active_days || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="contract_salary" className="input-label">
            contract salary <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="contract_salary"
            type="number"
            className="input"
            name="contract_salary"
            onChange={handleChange}
            value={inputs.contract_salary || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="labor_salary" className="input-label">
            labor salary <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="labor_salary"
            type="number"
            className="input"
            name="labor_salary"
            onChange={handleChange}
            value={inputs.labor_salary || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="insurance" className="input-label">
            insurance <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="insurance"
            type="number"
            className="input"
            name="insurance"
            onChange={handleChange}
            value={inputs.insurance || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="ppe" className="input-label">
            ppe <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="ppe"
            type="number"
            className="input"
            name="ppe"
            onChange={handleChange}
            value={inputs.ppe || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="transport" className="input-label">
            transport <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="transport"
            className="input"
            type="number"
            name="transport"
            onChange={handleChange}
            value={inputs.transport || ""}
          />
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
          className="button bg-cyan-700 hover:bg-cyan-600"
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
