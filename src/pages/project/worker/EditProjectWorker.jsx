import React, { useEffect, useState } from "react";
import Edit from "../../../API/project/worker/Edit";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetWorker from "../../../API/project/worker/GetWorker";

export default function EditProjectWorker() {
  const [inputs, setInputs] = useState({
    name: "",
    day: "",
    night: "",
    hours: "",
    cost_day: "",
    cost_hour: "",
    food: "",
    transportation: "",
    project_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [Worker, setWorker] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { projectId, workerId } = useParams();

  // Fetch project data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const itemData = await GetWorker(
          { workerId: workerId, projectId: projectId },
          setLoading,
          navigate
        );
        setWorker(itemData); // Set project data in state
        // Update inputs with project data
        if (itemData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            name: itemData.name || "",
            day: itemData.day || "",
            night: itemData.night || null,
            hours: itemData.hours || null,
            cost_day: itemData.cost_day || "",
            cost_hour: itemData.cost_hour || "",
            food: itemData.food || "",
            transportation: itemData.transportation || "",
            project_id: projectId, // Assuming id is correctly defined from useParams
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
  }, [projectId, workerId, navigate]);

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
          <label htmlFor="day" className="input-label">
            day <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="day"
            type="number"
            className="input"
            name="day"
            onChange={handleChange}
            value={inputs.day}
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
            value={inputs.night}
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
            value={inputs.hours}
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
            value={inputs.cost_hour}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="cost_day" className="input-label">
            cost_day <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="cost_day"
            type="number"
            className="input"
            name="cost_day"
            onChange={handleChange}
            value={inputs.cost_day}
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
            value={inputs.food}
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
            value={inputs.transportation}
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
