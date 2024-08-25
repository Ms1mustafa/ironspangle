import React, { useEffect, useState } from "react";
import Edit from "../../API/project/Edit";
import AuthCheck from "../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetProject from "../../API/project/GetProject";

export default function CreateUser() {
  const [inputs, setInputs] = useState({
    name: "",
    body: "",
    budget: "",
    po: "",
    pr: "",
    project_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState({});
  const navigate = useNavigate();
  const user = AuthCheck();
  const { id } = useParams();

  // Fetch project data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const projectData = await GetProject(id, setLoading, navigate);
        setProject(projectData); // Set project data in state
        // Update inputs with project data
        if (projectData) {
          setInputs((prevInputs) => ({
            ...prevInputs,
            name: projectData.name || "",
            body: projectData.body || "",
            budget: projectData.budget || "",
            po: projectData.po || "",
            pr: projectData.pr || "",
            project_id: id, // Assuming id is correctly defined from useParams
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
  }, [id, navigate]);

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
      <h1 className="text-3xl text-gray-600 font-bold mb-10">Edit Project</h1>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="project-name" className="input-label">
            Project Name <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="project-name"
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
          <label htmlFor="short-des" className="input-label">
            Short Description
          </label>
          <input
            id="short-des"
            className="input"
            name="body"
            onChange={handleChange}
            value={inputs.body}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="budget" className="input-label">
            Budget <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="budget"
            type="number"
            className="input"
            name="budget"
            onChange={handleChange}
            value={inputs.budget}
          />
          <p className="text-gray-600 text-xs italic"></p>
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
            value={inputs.po}
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
            value={inputs.pr}
          />
        </div>
      </div>
      <LaddaButton
        className="button"
        data-style={EXPAND_LEFT}
        loading={loading}
        type="submit"
      >
        Update Project
      </LaddaButton>
    </form>
  );
}
