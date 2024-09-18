import ApiPaths from "../statics/ApiPaths";
import useApi from "../utils/apiUtils";
import userSession from "../utils/userSession";

const useAuthService = () => {
  const api = useApi();

  const login = async ({ email, password }) => {
    const authResponse = await api.post(ApiPaths.Authenticate, {
      id: email,
      key: password,
      AppId: import.meta.env.VITE_CLIENT_ID,
      AppKey: import.meta.env.VITE_CLIENT_SECRET,
    });

    userSession.saveAuthSession(authResponse.jwt, authResponse.userDetails);
  };

  const register = async ({
    firstName,
    lastName,
    email,
    password,
    age,
    address,
    healthIssues,
  }) => {
    await api.post(ApiPaths.RegisterUser, {
      firstName,
      lastName,
      email,
      password,
      age,
      address,
      healthIssues,
    });
  };

  const registerDoctor = async ({
    firstName,
    lastName,
    email,
    password,
    degreeId,
    specializationsList,
    programsList,
    unavailableList,
  }) => {
    await api.post(ApiPaths.RegiserDoctor, {
      firstName,
      lastName,
      email,
      password,
      degreeId,
      specializationsList,
      programsList,
      unavailableList,
    });
  };

  const fetchDetails = async () => {
    const user = userSession.user();

    if (user && user.id) {
      const userDetails = await api.get(ApiPaths.GetUserById(user.id));
      return userDetails;
    }

    return {};
  };

  const profileDetails = async () => {
    const user = userSession.user();

    if (user && user.id) {
      let userDetails = await api.get(
        user.roleId == 1
          ? ApiPaths.Profile(user.id)
          : ApiPaths.DoctorProfile(user.id)
      );
      if (!userDetails.roleId) {
        userDetails = { ...userDetails, roleId: user.roleId };
      }
      return userDetails;
    }
    return {};
  };

  const profileUpdate = async (updatedUser, file) => {
    if (updatedUser) {
      const formData = new FormData();
      formData.append("id", updatedUser.id);
      formData.append("address", updatedUser.address);
      formData.append("healthIssues", updatedUser.healthIssues);
      formData.append("photo", file);
      return await api.put(ApiPaths.UpdateProfile, formData, true);
    }
    return {};
  };

  const profileUpdateDoctor = async (updatedUser, file) => {
    if (updatedUser) {
      const formData = new FormData();
      formData.append("id", updatedUser.id);
      formData.append("degreeName", updatedUser.degreeName);
      formData.append("firstName", updatedUser.firstName);
      formData.append("lastName", updatedUser.lastName);
      formData.append("roleId", updatedUser.roleId);
      formData.append("photo", file);
      if (
        updatedUser.specializationsList &&
        updatedUser.specializationsList.length > 0
      ) {
        formData.append(
          "specializationsList",
          JSON.stringify(updatedUser.specializationsList)
        );
      }
      return await api.put(ApiPaths.UpdateDoctorProfile, formData, true);
    }
    return {};
  };

  const getAllUsers = async () => {
    return await api.post(ApiPaths.GetAllUsers, {});
  };

  const deactivateUser = async (userId) => {
    console.log("a intrat");
    return await api.put(ApiPaths.DeactivateUser(userId), {});
  };

  return {
    login,
    register,
    registerDoctor,
    fetchDetails,
    profileDetails,
    profileUpdate,
    profileUpdateDoctor,
    getAllUsers,
    deactivateUser,
  };
};

export default useAuthService;
