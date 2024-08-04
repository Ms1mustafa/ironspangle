import axios from "axios";
import toast from "react-hot-toast";

const GetTotals = async (id, setLoading, navigate = null) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_REACT_APP_API_URL
      }/supply_chain/totals.php?supply_chain_id=${id}`
    );
    setLoading(false);
    if (response.status === 200) {
      return response.data; // Return project data if successful
    } else {
      if (navigate) navigate("/supply_chain");
      throw new Error(response.data.message); // Throw an error if request fails
    }
  } catch (error) {
    if (navigate) navigate("/supply_chain");
    toast.error("Failed to fetch Supply Chain totals."); // Display specific error message using toast
    setLoading(false);
    throw error; // Re-throw error for further handling if needed
  }
};

export default GetTotals;
