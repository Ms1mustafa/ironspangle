import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Input from "../components/Input";
import LaddaButton, { EXPAND_LEFT } from "react-ladda-button";
import "react-ladda-button/dist/ladda-themeless.min.css";
import AuthCheck from "../API/account/AuthCheck";

export default function Login() {
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const user = AuthCheck();

  useEffect(() => {
    if (user?.data && cookies.token) {
      navigate("/");
    }
  }, [user?.data, cookies.token, navigate]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    setError(null);
  };

  function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();

    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_URL}/user/login.php`, inputs)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response.data.user.token);
          setCookie("token", response.data.user.token, {
            path: "/",
            secure: true,
            sameSite: "strict",
            maxAge: 3600,
          });
          setLoading(false);
          navigate("/");
        } else {
          setError("Unexpected error occurred. Please try again.");
          setLoading(false);
        }
      })
      .catch(function (error) {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Unexpected error occurred. Please try again.");
        }
        setLoading(false);
      });
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <Input name="email" onChange={handleChange} />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <Input
                  name="password"
                  type="password"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <LaddaButton
                className="button"
                data-style={EXPAND_LEFT}
                loading={loading}
              >
                Sign in
              </LaddaButton>
            </div>

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>
        </div>
      </div>
    </>
  );
}
