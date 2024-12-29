import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;

export const useLogin = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const login = async (form) => {
    try {
      const response = await axios.post(`${baseUrl}/login`, form);

      const isAdmin = form.username === "Admin";

      localStorage.setItem("isAdmin", isAdmin);
      localStorage.setItem("userId", response.data._id);
      setUser({ ...response.data, isAdmin });
      console.log(response.data);
      navigate("/", { replace: true });

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return (
        error.response || { status: 500, message: "Unexpected error occurred" }
      );
    }
  };

  return login;
};
