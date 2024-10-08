import React, { useEffect, useState } from "react";
import Edit from "../../../API/admin/worker/Edit";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetWorker from "../../../API/admin/worker/GetWorker";

export default function EditProjectWorker() {
  const [inputs, setInputs] = useState({
    name: "",
    job: "",
    active_days: "",
    contract_salary: "",
    salary: "",
    insurance: "",
    ppe: "",
    rewards: "",
    insurance2: "",
    pr_days: "",
    pr_cost: "",
    transport: "",
    admin_id: "",
    worker_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [Worker, setWorker] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { admin_id, worker_id } = useParams();

  // Fetch project data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const workerData = await GetWorker(
          { workerId: worker_id, admin_id: admin_id },
          setLoading,
          navigate
        );
        setWorker(workerData); // Set project data in state
        // Update inputs with project data
        if (workerData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            name: workerData.name || "",
            job: workerData.job || "",
            active_days: workerData.active_days || "",
            contract_salary: workerData.contract_salary || "",
            salary: workerData.salary || "",
            insurance: workerData.insurance || "",
            ppe: workerData.ppe || "",
            rewards: workerData.rewards || "",
            insurance2: workerData.insurance2 || "",
            pr_days: workerData.pr_days || "",
            pr_cost: workerData.pr_cost || "",
            transport: workerData.transport || "",
            admin_id: admin_id,
            worker_id: worker_id,
          }));
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        // Handle error or display message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [admin_id, worker_id, navigate]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Edit(inputs, setLoading, navigate);
      console.log("Project updated successfully:", inputs);
      // Optionally, you can navigate to another page or show a success message
    } catch (error) {
      console.error("Error updating project:", error);
      // Handle error or display message
    }
  };

  return (
    <form className="form w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Edit Worker</h1>
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
            value={inputs.name}
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
            value={inputs.job}
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
            value={inputs.active_days}
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
            value={inputs.contract_salary}
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
            value={inputs.salary}
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
            value={inputs.insurance}
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
            value={inputs.insurance2}
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
            value={inputs.ppe}
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
            value={inputs.rewards}
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
            value={inputs.pr_days}
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
            value={inputs.pr_cost}
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
            name="transport"
            type="number"
            onChange={handleChange}
            value={inputs.transport}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
        type="submit"
        disabled={user?.data.role !== "admin"}
      >
        Update Item
      </LaddaButton>
    </form>
  );
}
