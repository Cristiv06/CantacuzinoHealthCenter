import ApiPaths from "../statics/ApiPaths";
import useApi from "../utils/apiUtils";

const useReviewService = () => {
  const api = useApi();

  const leaveReview = async (reviewData) => {
    return await api.post(ApiPaths.LeaveReview, reviewData);
  };

  return { leaveReview };
};

export default useReviewService;
