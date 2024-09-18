import ApiPaths from "../statics/ApiPaths";
import useApi from "../utils/apiUtils";
import userSession from "../utils/userSession";
import parser from "../utils/BodyParser";

const useAppointmentService = () => {
  const api = useApi();

  const getAppointments = async () => {
    return await api.get(ApiPaths.GetAppointments, {});
  };

  const setAppointmentState = async (updatedState) => {
    return await api.put(ApiPaths.SetAppointmentState, updatedState);
  };

  const deleteAppointment = async (appointmentId) => {
    return await api.delete(ApiPaths.DeleteAppointment(appointmentId), {});
  };

  return { getAppointments, setAppointmentState, deleteAppointment };
};

export default useAppointmentService;
