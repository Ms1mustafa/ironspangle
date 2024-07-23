import axios from "axios";
import toast from "react-hot-toast";

const GetProjectItem = async (data, setLoading, navigate = null) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_API_URL}/project/item/get.php?itemId=${
        data.itemId
      }`
    );
    setLoading(false);
    if (response.status === 200) {
      return response.data;
    } else {
      if (navigate) navigate(`/projects/${data.projectId}/items`);
      throw new Error(response.data.message);
    }
  } catch (error) {
    if (navigate) navigate("/projects");
    toast.error("Failed to fetch Item.");
    setLoading(false);
    throw error;
  }
};

export default GetProjectItem;
