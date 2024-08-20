import axios from "axios";
import toast from "react-hot-toast";

const GetInvoice = async (data, setLoading, navigate = null) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_API_URL}/invoice/list.php?id=${
        data.invoice_id
      }`
    );
    setLoading(false);
    if (response.status === 200) {
      return response.data;
    } else {
      if (navigate) navigate(`/swift/${data.id}/invoices`);
      throw new Error(response.data.message);
    }
  } catch (error) {
    if (navigate) navigate("/swift");
    toast.error("Failed to fetch invoice.");
    setLoading(false);
    throw error;
  }
};

export default GetInvoice;
