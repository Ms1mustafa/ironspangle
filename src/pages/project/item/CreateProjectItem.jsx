import { useEffect, useState } from "react";
import AuthCheck from "../../../API/account/AuthCheck";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import { useNavigate, useParams } from "react-router-dom";
import GetProject from "../../../API/project/GetProject";
import toast from "react-hot-toast";
import CreateItem from "../../../API/project/item/CreateItem";

export default function CreateProjectItem() {
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
    CreateItem(inputs, setLoading, navigate);
  }

  function CreateAnother() {
    CreateItem(inputs, setLoading);
    //empty inputs
    setInputs({ project_id: id, created_by: user?.data.name });
  }

  return (
    <form className="w-full p-10 max-w-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl text-gray-600 font-bold mb-3">
        Create Project Item
      </h1>
      <p className="text-gray-600 mb-10">{project?.name ?? "loading..."}</p>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="item-name" className="input-label">
            Item Name <span className="text-red-500 text-sm">*</span>
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
          <label htmlFor="unit" className="input-label">
            Unit <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="unit"
            className="input"
            name="unit"
            onChange={handleChange}
            value={inputs.unit || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="qty" className="input-label">
            QTY <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="qty"
            type="number"
            className="input"
            name="qty"
            onChange={handleChange}
            value={inputs.qty || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="unit-price" className="input-label">
            Unit Price <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="unit-price"
            type="number"
            className="input"
            name="unit_price"
            onChange={handleChange}
            value={inputs.unit_price || ""}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="trans" className="input-label">
            Trans <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="trans"
            type="number"
            className="input"
            name="trans"
            onChange={handleChange}
            value={inputs.trans || ""}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="remarks" className="input-label">
            Remarks <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="remarks"
            className="input"
            name="remarks"
            onChange={handleChange}
            value={inputs.remarks || ""}
          />
          <p className="text-gray-600 text-xs italic"></p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="date" className="input-label">
            Date <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            id="date"
            type="date"
            className="input"
            name="date"
            onChange={handleChange}
            value={inputs.date || ""}
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
