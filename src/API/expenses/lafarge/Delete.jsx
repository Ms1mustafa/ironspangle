import axios from "axios";
import toast from "react-hot-toast";

const Delete = async (id, setLoading, refreshProjects) => {
  setLoading(true);

  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_REACT_APP_API_URL}/expense/lafarge/delete.php`,
      {
        data: { id },
      }
    );

    if (response.status === 200) {
      toast.success(response.data.message);
      refreshProjects(); // Refresh projects list after successful deletion
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete expense.");
  } finally {
    setLoading(false); // Ensure loading state is always set to false
  }
};

export default Delete;