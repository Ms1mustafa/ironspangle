// AuthCheck.js
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCheck = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return; // exit early if no token
    }

    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/user/login.php`, {
        params: { token: token },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data); // Assuming response.data contains user info
        } else {
          navigate("/login", { replace: true });
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/login", { replace: true });
      });
  }, [token, navigate]);

  return user;
};

export default AuthCheck;
