import { useEffect, useState } from "react";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetAdmin from "../../../API/admin/GetAdmin";
import CreateWorker from "../../../API/admin/worker/CreateWorker";

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
        const projectData = await GetAdmin(id, setLoading, navigate); // Await GetAdmin promise
        setProject(projectData); // Set project data in state
      } catch (error) {
        // toast.error(error.message); // Display specific error message using toast
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    setInputs((values) => ({ ...values, admin_id: id }));
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
    setInputs({ admin_id: id, created_by: user?.data.name });
  }

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">
        Create Admin Worker
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
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="job" className="input-label">
            job <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="job"
            className="input"
            name="job"
            onChange={handleChange}
            value={inputs.job || ""}
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
          <label htmlFor="salary" className="input-label">
            salary <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="salary"
            type="number"
            className="input"
            name="salary"
            onChange={handleChange}
            value={inputs.salary || ""}
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
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="insurance2" className="input-label">
            insurance2 <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="insurance2"
            type="number"
            className="input"
            name="insurance2"
            onChange={handleChange}
            value={inputs.insurance2 || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
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
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="rewards" className="input-label">
            rewards
          </label>
          <input
            id="rewards"
            type="number"
            className="input"
            name="rewards"
            onChange={handleChange}
            value={inputs.rewards || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="pr_days" className="input-label">
            pr days <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="pr_days"
            type="number"
            className="input"
            name="pr_days"
            onChange={handleChange}
            value={inputs.pr_days || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="pr_cost" className="input-label">
            pr cost <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="pr_cost"
            type="number"
            className="input"
            name="pr_cost"
            onChange={handleChange}
            value={inputs.pr_cost || ""}
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
