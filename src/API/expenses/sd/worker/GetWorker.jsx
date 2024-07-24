import axios from "axios";
import toast from "react-hot-toast";

const GetProject = async (data, setLoading, navigate = null) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_REACT_APP_API_URL
      }/expense/sd/worker/get.php?workerId=${data.workerId}`
    );
    setLoading(false);
    if (response.status === 200) {
      return response.data;
    } else {
      if (navigate) navigate(`/expenses/sd/${data.sd_id}/workers`);
      throw new Error(response.data.message);
    }
  } catch (error) {
    if (navigate) navigate("/expenses/sd");
    toast.error("Failed to fetch Worker.");
    setLoading(false);
    throw error;
  }
};

export default GetProject;
