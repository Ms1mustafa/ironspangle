import React, { useEffect, useState } from "react";
import Edit from "../../../API/mec/worker/Edit";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetWorker from "../../../API/mec/worker/GetWorker";

export default function EditProjectWorker() {
  const [inputs, setInputs] = useState({
    name: "",
    status: "",
    contract_days: "",
    active_days: "",
    contract_salary: "",
    labor_salary: "",
    insurance: "",
    ppe: "",
    transport: "",
    mec_id: "",
    worker_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [Worker, setWorker] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { mec_id, worker_id } = useParams();

  // Fetch project data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const workerData = await GetWorker(
          { workerId: worker_id, mec_id: mec_id },
          setLoading,
          navigate
        );
        setWorker(workerData); // Set project data in state
        // Update inputs with project data
        if (workerData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            name: workerData.name || "",
            status: workerData.status || "",
            contract_days: workerData.contract_days || "",
            active_days: workerData.active_days || "",
            contract_salary: workerData.contract_salary || "",
            labor_salary: workerData.labor_salary || "",
            insurance: workerData.insurance || "",
            ppe: workerData.ppe || "",
            transport: workerData.transport || "",
            mec_id: mec_id,
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
  }, [mec_id, worker_id, navigate]);

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
        <div className="w-full px-3">
          <label htmlFor="status" className="input-label">
            status <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="status"
            className="input"
            name="status"
            onChange={handleChange}
            value={inputs.status}
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
            value={inputs.contract_days}
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
          <label htmlFor="labor_salary" className="input-label">
            labor salary <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="labor_salary"
            type="number"
            className="input"
            name="labor_salary"
            onChange={handleChange}
            value={inputs.labor_salary}
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
      >
        Update Item
      </LaddaButton>
    </form>
  );
}
