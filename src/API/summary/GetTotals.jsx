import axios from "axios";
import toast from "react-hot-toast";

const GetTotals = async (year, setLoading, navigate = null) => {
  setLoading(true);
  try {
    // Create an array of promises for the API calls
    const [
      adminTotalsPromise,
      mecTotalsPromise,
      supplyChainTotalsPromise,
      employeeCompanyPromise,
    ] = [
      axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/admin/totals.php?year=${year}`
      ),
      axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/mec/totals.php?year=${year}`
      ),
      axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/supply_chain/totals.php?year=${year}`
      ),
      axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/employee_company/list.php?year=${year}`
      ),
    ];

    // Await all promises to resolve
    const [
      adminTotalsResponse,
      mecTotalsResponse,
      supplyChainTotalsResponse,
      employeeCompanyResponse,
    ] = await Promise.all([
      adminTotalsPromise,
      mecTotalsPromise,
      supplyChainTotalsPromise,
      employeeCompanyPromise,
    ]);

    setLoading(false);

    // Check if all responses are successful
    if (
      adminTotalsResponse.status === 200 &&
      mecTotalsResponse.status === 200 &&
      supplyChainTotalsResponse.status === 200 &&
      employeeCompanyResponse.status === 200
    ) {
      // Return combined data
      return {
        adminTotals: adminTotalsResponse.data,
        mecTotals: mecTotalsResponse.data,
        supplyChainTotals: supplyChainTotalsResponse.data,
        employeeCompanyTotals: employeeCompanyResponse.data,
      };
    } else {
      if (navigate) navigate("/admin");
      throw new Error("One or more requests failed."); // Throw a general error
    }
  } catch (error) {
    if (navigate) navigate("/admin");
    toast.error("Failed to fetch totals."); // Display a specific error message using toast
    setLoading(false);
    throw error; // Re-throw error for further handling if needed
  }
};

export default GetTotals;
