import ApiPaths from "../statics/ApiPaths";
import useApi from "../utils/apiUtils";
import userSession from "../utils/userSession";
import parser from "../utils/BodyParser";

const useNotificationService = () => {
  const api = useApi();

  const getAllNotifications = async () => {
    return await api.get(ApiPaths.GetAllNotifications, {});
  };

  const readNotification = async (updatedState) => {
    return await api.put(ApiPaths.ReadNotification, updatedState);
  };

  const addNotification = async (notificationData) => {
    return await api.post(ApiPaths.AddNotification, notificationData);
  };

  return { getAllNotifications, readNotification, addNotification };
};

export default useNotificationService;
