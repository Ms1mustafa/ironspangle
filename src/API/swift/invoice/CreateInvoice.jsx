import axios from "axios";
import toast from "react-hot-toast";

const CreateInvoice = (data, setLoading, navigate = null) => {
  setLoading(true);
  axios
    .post(`${import.meta.env.VITE_REACT_APP_API_URL}/invoice/create.php`, data)
    .then((response) => {
      setLoading(false);
      if (response.status === 200) {
        toast.success(response.data.message);
        if (navigate) {
          navigate(`/swift/${data.swift_id}/invoice`, {
            replace: true,
          });
        }
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

export default CreateInvoice;
