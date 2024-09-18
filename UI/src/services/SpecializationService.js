import ApiPaths from "../statics/ApiPaths";
import useApi from "../utils/apiUtils";
import userSession from "../utils/userSession";

const useSpecializationService = () => {
  const api = useApi();
  const getAllSpecializations = async () => {
    return await api.post(ApiPaths.GetAllSpecializations, {});
  };

  return {
    getAllSpecializations,
  };
};

export default useSpecializationService;
