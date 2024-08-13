import axios from "axios";
import toast from "react-hot-toast";

const Create = (data, setLoading, navigate) => {
  setLoading(true);
  axios
    .post(
      `${import.meta.env.VITE_REACT_APP_API_URL}/employee_company/create.php`,
      data
    )
    .then((response) => {
      setLoading(false);
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate(`/employee_company`, {
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

export default Create;
