import { useEffect, useState } from "react";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetProject from "../../../API/project/GetProject";
import toast from "react-hot-toast";
import CreateWorker from "../../../API/project/worker/CreateWorker";

export default function CreateProjectWorker() {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const projectData = await GetProject(id, setLoading, navigate); // Await GetProject promise
        setProject(projectData); // Set project data in state
      } catch (error) {
        // toast.error(error.message); // Display specific error message using toast
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    setInputs((values) => ({ ...values, project_id: id }));
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
    setInputs({ project_id: id, created_by: user?.data.name });
  }

  return (
    <form className="w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-3">
        Create Project Worker
      </h1>
      <p className="text-gray-600 mb-10">{project?.name ?? "loading..."}</p>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="item-name" className="input-label">
            Name <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="item-name"
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
          <label htmlFor="day" className="input-label">
            day <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="day"
            type="number"
            className="input"
            name="day"
            onChange={handleChange}
            value={inputs.day || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="night" className="input-label">
            night
          </label>
          <input
            id="night"
            type="number"
            className="input"
            name="night"
            onChange={handleChange}
            value={inputs.night || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="hours" className="input-label">
            hours
          </label>
          <input
            id="hours"
            type="number"
            className="input"
            name="hours"
            onChange={handleChange}
            value={inputs.hours || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="cost_hour" className="input-label">
            cost hour <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="cost_hour"
            type="number"
            className="input"
            name="cost_hour"
            onChange={handleChange}
            value={inputs.cost_hour || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="cost_day" className="input-label">
            cost day <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="cost_day"
            type="number"
            className="input"
            name="cost_day"
            onChange={handleChange}
            value={inputs.cost_day || ""}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="food" className="input-label">
            food <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="food"
            type="number"
            className="input"
            name="food"
            onChange={handleChange}
            value={inputs.food || ""}
          />
          <p className="text-gray-600 text-xs italic"></p>
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
