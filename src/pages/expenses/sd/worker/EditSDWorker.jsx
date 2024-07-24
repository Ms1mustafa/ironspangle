import React, { useEffect, useState } from "react";
import Edit from "../../../../API/expenses/sd/worker/Edit";
import AuthCheck from "../../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetWorker from "../../../../API/expenses/sd/worker/GetWorker";

export default function EditSDWorker() {
  const [inputs, setInputs] = useState({
    name: "",
    days: "",
    day_cost: "",
    transportation: "",
    day_salary: "",
    worker_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [Worker, setWorker] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { sd_id, workerId } = useParams();

  // Fetch project data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const itemData = await GetWorker(
          { workerId: workerId, sd_id: sd_id },
          setLoading,
          navigate
        );
        setWorker(itemData); // Set project data in state
        // Update inputs with project data
        if (itemData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            name: itemData.name || "",
            days: itemData.days || "",
            day_cost: itemData.day_cost || "",
            transportation: itemData.transportation || "",
            day_salary: itemData.day_salary || "",
            sd_id: sd_id, // Assuming id is correctly defined from useParams
            worker_id: workerId,
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
  }, [sd_id, workerId, navigate]);

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
    <form className="w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Edit Worker</h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="item-name" className="input-label">
            Worker Name <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="worker-name"
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
          <label htmlFor="days" className="input-label">
            days <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="days"
            type="number"
            className="input"
            name="days"
            onChange={handleChange}
            value={inputs.days}
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="day_cost" className="input-label">
            day_cost
          </label>
          <input
            id="day_cost"
            type="number"
            className="input"
            name="day_cost"
            onChange={handleChange}
            value={inputs.day_cost}
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
            value={inputs.transportation}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="day_salary" className="input-label">
            day_salary <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="day_salary"
            type="number"
            className="input"
            name="day_salary"
            onChange={handleChange}
            value={inputs.day_salary}
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
