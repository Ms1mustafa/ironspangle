import axios from "axios";
import toast from "react-hot-toast";

const Delete = async (id, setLoading, refreshSwift) => {
  setLoading(true);

  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_REACT_APP_API_URL}/swift/delete.php`,
      {
        data: { id },
      }
    );

    if (response.status === 200) {
      toast.success(response.data.message);
      refreshSwift(); // Refresh po list after successful deletion
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete SWIFT.");
  } finally {
    setLoading(false); // Ensure loading state is always set to false
  }
};

export default Delete;