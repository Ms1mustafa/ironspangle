import axios from "axios";
import toast from "react-hot-toast";

const Remove_swift = (data, setLoading, navigate) => {
  setLoading(true);
  axios
    .put(
      `${import.meta.env.VITE_REACT_APP_API_URL}/invoice/remove_swift.php`,
      data
    )
    .then((response) => {
      setLoading(false);
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate(`/invoice`, {
          replace: true,
        });
      } else {
        toast.error(response.data.message);
      }
    })
    .catch((error) => {
      toast.error(error.response.data.message); // Displaying specific error message
    })
    .finally(() => {
      setLoading(false);
    });
};

export default Remove_swift;
