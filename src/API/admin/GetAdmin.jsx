import axios from "axios";
import toast from "react-hot-toast";

const GetAdmin = async (id, setLoading, navigate = null) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_API_URL}/admin/list.php?id=${id}`
    );
    setLoading(false);
    if (response.status === 200) {
      return response.data; // Return project data if successful
    } else {
      if (navigate) navigate("/admin");
      throw new Error(response.data.message); // Throw an error if request fails
    }
  } catch (error) {
    if (navigate) navigate("/admin");
    toast.error("Failed to fetch Admin."); // Display specific error message using toast
    setLoading(false);
    throw error; // Re-throw error for further handling if needed
  }
};

export default GetAdmin;
