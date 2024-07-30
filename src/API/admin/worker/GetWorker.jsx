import axios from "axios";
import toast from "react-hot-toast";

const GetWorker = async (data, setLoading, navigate = null) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_REACT_APP_API_URL
      }/admin/worker/get.php?workerId=${data.workerId}`
    );
    setLoading(false);
    if (response.status === 200) {
      return response.data;
    } else {
      if (navigate) navigate(`/admin/${data.adminId}/workers`);
      throw new Error(response.data.message);
    }
  } catch (error) {
    if (navigate) navigate("/admin");
    toast.error("Failed to fetch Worker.");
    setLoading(false);
    throw error;
  }
};

export default GetWorker;
