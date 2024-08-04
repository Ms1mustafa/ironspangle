import axios from "axios";
import toast from "react-hot-toast";

const Delete = async (id, setLoading, refreshSupply_chain) => {
  setLoading(true);

  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_REACT_APP_API_URL}/supply_chain/delete.php`,
      {
        data: { id },
      }
    );

    if (response.status === 200) {
      toast.success(response.data.message);
      refreshSupply_chain(); // Refresh Supply_chains list after successful deletion
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to delete Supply chain."
    );
  } finally {
    setLoading(false); // Ensure loading state is always set to false
  }
};

export default Delete;
