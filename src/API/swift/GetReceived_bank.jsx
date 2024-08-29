import axios from "axios";
import toast from "react-hot-toast";

const GetReceived_bank = async (setLoading, navigate = null) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_API_URL}/swift/list.php`
    );
    setLoading(false);
    if (response.status === 200) {
      return response.data; // Return po data if successful
    } else {
      if (navigate) navigate("/received_at_bank");
      throw new Error(response.data.message); // Throw an error if request fails
    }
  } catch (error) {
    if (navigate) navigate("/received_at_bank");
    toast.error("Failed to fetch data."); // Display specific error message using toast
    setLoading(false);
    throw error; // Re-throw error for further handling if needed
  }
};

export default GetReceived_bank;
