import axios from "axios";
import toast from "react-hot-toast";

const Delete = async (id, setLoading, refreshEmployee_company) => {
  setLoading(true);

  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_REACT_APP_API_URL}/employee_company/delete.php`,
      {
        data: { id },
      }
    );

    if (response.status === 200) {
      toast.success(response.data.message);
      refreshEmployee_company(); // Refresh employee_companys list after successful deletion
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to delete employee company."
    );
  } finally {
    setLoading(false); // Ensure loading state is always set to false
  }
};

export default Delete;
