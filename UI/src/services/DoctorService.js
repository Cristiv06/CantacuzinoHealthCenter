import ApiPaths from "../statics/ApiPaths";
import useApi from "../utils/apiUtils";
import userSession from "../utils/userSession";
import parser from "../utils/BodyParser";
import { formatDateToISO8601 } from "../pages/Doctors/AllDoctors";

const useDoctorService = () => {
  const api = useApi();
  const getAllDoctors = async (
    NameFilter,
    SpecializationIdFilter,
    DegreeIdFilter,
    SortBy,
    SortDesc,
    Skip,
    Take
  ) => {
    return await api.post(
      ApiPaths.GetAllDoctors,
      parser(
        NameFilter,
        SpecializationIdFilter,
        DegreeIdFilter,
        SortBy,
        SortDesc,
        Skip,
        Take
      )
    );
  };

  const getDegrees = async () => {
    return await api.post(ApiPaths.GetAllDegrees, {});
  };

  const getSpecializations = async () => {
    return await api.post(ApiPaths.GetAllSpecializations, {});
  };

  const getDoctorPrograms = async () => {
    return await api.get(ApiPaths.GetDoctorPrograms, {});
  };

  const createDoctorProgram = async (data) => {
    return await api.post(ApiPaths.CreateDoctorProgram, data);
  };

  const getReasons = async () => {
    return await api.post(ApiPaths.GetAllReasons, {});
  };

  const getUnavailable = async (doctorId) => {
    const response = await api.get(ApiPaths.GetUnavailablePeriods(doctorId));
    return response;
  };

  const getUnAvailableHours = async (doctorId, date) => {
    try {
      const formattedDate = formatDateToISO8601(new Date(date)).split("T")[0];
      const response = await api.get(
        `/appointment/program/${doctorId}/${formattedDate}`
      );

      console.log("Response Status:", response.status);
      console.log("Response StatusText:", response.statusText);

      const data = await response;
      console.log(data);
      const formattedData = data.unavailableSlot?.map((slot) =>
        new Date(slot.start).getHours()
      ); //!!!!
      const startHour = data?.startHour;
      const endHour = data?.endHour;
      return {
        startHour,
        endHour,
        unavailablePerios: formattedData,
      };
    } catch (error) {
      console.error("Error fetching unavailable hours:", error);
      throw error;
    }
  };

  const createAppointment = async (appointmentData) => {
    return await api.post(ApiPaths.CreateAppointment, appointmentData);
  };

  return {
    getAllDoctors,
    getDegrees,
    getSpecializations,
    getDoctorPrograms,
    createDoctorProgram,
    getReasons,
    getUnavailable,
    getUnAvailableHours,
    createAppointment,
  };
};

export default useDoctorService;
