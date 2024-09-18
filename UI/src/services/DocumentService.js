import ApiPaths from "../statics/ApiPaths";
import useApi from "../utils/apiUtils";
import userSession from "../utils/userSession";
import parser from "../utils/BodyParser";

const useDocumentService = () => {
  const api = useApi();

  const uploadDocument = async (data) => {
    const formData = new FormData();
    formData.append("File", data.file);
    formData.append("idAppointment", data.idAppointment);
    return await api.post(ApiPaths.UploadDocument, formData, true);
  };

  const downloadDocument = async (documentId) => {
    return await api.get(ApiPaths.DownloadDocument(documentId));
  };

  const uploadUserPicture = async (data) => {
    const formData = new FormData();
    formData.append("File", data.file);
    formData.append("idUser", data.idUser);
    return await api.post(ApiPaths.UploadUserPicture, formData, true);
  };

  const uploadSpecializationPicture = async (data) => {
    const formData = new FormData();
    formData.append("File", data.file);
    formData.append("idSpecialization", data.idSpecialization);
    return await api.post(ApiPaths.UploadSpecializationPicture, formData, true);
  };

  return {
    uploadDocument,
    uploadUserPicture,
    uploadSpecializationPicture,
    downloadDocument,
  };
};

export default useDocumentService;
