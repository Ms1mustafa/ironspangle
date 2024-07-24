import axios from "axios";
import toast from "react-hot-toast";

const GetTotals = async (id, setLoading, navigate = null) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_REACT_APP_API_URL
      }/project/totals.php?project_id=${id}`
    );
    setLoading(false);
    if (response.status === 200) {
      return response.data; // Return project data if successful
    } else {
      if (navigate) navigate("/projects");
      throw new Error(response.data.message); // Throw an error if request fails
    }
  } catch (error) {
    if (navigate) navigate("/projects");
    toast.error("Failed to fetch project totals."); // Display specific error message using toast
    setLoading(false);
    throw error; // Re-throw error for further handling if needed
  }
};

export default GetTotals;
