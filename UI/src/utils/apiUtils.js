import { useNavigate } from "react-router-dom";
import userSession from "./userSession";
import axios from "axios";

const useApi = () => {
  const navigate = useNavigate();

  const call = async (method, path, payload, isForm, isPhoto) => {
    const url = `${import.meta.env.VITE_API_URL}${path}`;
    const headers = {
      "Content-Type": isForm ? "multipart/form-data" : "application/json",
      Authorization: `Bearer ${userSession.token()}`,
      // responseType: "arraybuffer",
    };

    const options = {
      method: method,
      headers: headers,
    };

    console.log(payload);

    if (payload) {
      options.data = !isForm ? JSON.stringify(payload) : payload;
    }

    console.log(payload);

    console.log(options.data);

    try {
      const response = await axios({
        url: url,
        ...options,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error(`${error.response.status}: ${error.response.statusText}`);
        switch (error.response.status) {
          case 401:
          case 403:
            userSession.clearAuthSession();
            navigate("/");
            break;
          // Add more cases as needed
          case 422:
            throw {
              status: error.response.status,
              message: error.response.data || "An error occurred",
            };
          default:
            navigate("/error", {
              state: {
                status: error.response.status,
                message: error.response.data.message || "An error occurred",
              },
            });
            break;
        }
      } else {
        console.error("Error: ", error.message);
        navigate("/error", {
          state: {
            status: "Unknown",
            message: error.message || "An error occurred",
          },
        });
      }
      throw error;
    }
  };

  return {
    get: async (path, payload) => {
      return await call("GET", path, payload);
    },
    post: async (path, payload, isForm = false) => {
      return await call("POST", path, payload, isForm);
    },
    put: async (path, payload, isForm = false) => {
      return await call("PUT", path, payload, isForm);
    },
    delete: async (path, payload) => {
      return await call("DELETE", path, payload);
    },
  };
};

export default useApi;
