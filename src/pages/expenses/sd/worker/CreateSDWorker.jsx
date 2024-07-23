import { useEffect, useState } from "react";
import AuthCheck from "../../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetSD from "../../../../API/expenses/sd/GetSD";
import CreateWorker from "../../../../API/expenses/sd/worker/CreateWorker";

export default function CreateSDWorker() {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [SD, setSD] = useState(null);
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const SDData = await GetSD(id, setLoading, navigate); // Await GetSD promise
        setSD(SDData); // Set SD data in state
      } catch (error) {
        // toast.error(error.message); // Display specific error message using toast
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    setInputs((values) => ({ ...values, sd_id: id }));
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
    setInputs({ sd_id: id, created_by: user?.data.name });
  }

  return (
    <form className="w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-3">
        Create SD Worker
      </h1>
      <p className="text-gray-600 mb-10">{SD?.name ?? "loading..."}</p>
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
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="days" className="input-label">
            days <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="days"
            type="number"
            className="input"
            name="days"
            onChange={handleChange}
            value={inputs.days || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="day_cost" className="input-label">
            day cost
          </label>
          <input
            id="day_cost"
            type="number"
            className="input"
            name="day_cost"
            onChange={handleChange}
            value={inputs.day_cost || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="transportation" className="input-label">
            transportation <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="transportation"
            type="number"
            className="input"
            name="transportation"
            onChange={handleChange}
            value={inputs.transportation || ""}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="day_salary" className="input-label">
            day salary <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="day_salary"
            type="number"
            className="input"
            name="day_salary"
            onChange={handleChange}
            value={inputs.day_salary || ""}
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
