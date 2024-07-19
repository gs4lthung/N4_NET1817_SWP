import axios from "axios";
export const receivePendingRequest = async (
  consultingStaffId,
  pendingRequestId,
  token,
  setIsReceived,
  toast
) => {
  setIsReceived(true);
  axios
    .post(
      `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/process-request/create`,
      {
        pendingRequestId: pendingRequestId,
        consultingStaffId: consultingStaffId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      setIsReceived(false);
      if (res.data === "Have already received !") {
        toast({
          title: res.data.message,
          status: "warning",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: res.data.message,
          status: "success",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      }
    })
    .catch((err) => {
      setIsReceived(false);
      toast({
        title: err.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const cancelPendingRequest = async (
  id,
  type,
  token,
  setIsCanceled,
  toast
) => {
  setIsCanceled(true);
  axios
    .delete(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/pending-request/delete?id=${id}&type=${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      setIsCanceled(false);
      if (res.status === 200) {
        if (res.data.includes("successful")) {
          toast({
            title: res.data,
            status: "success",
            position: "top-right",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: res.data,
            status: "warning",
            position: "top-right",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    })
    .catch((err) => {
      setIsCanceled(false);
      toast({
        title: err.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const fetchPendingRequestImages = async (
  pendingRequestId,
  setDiamondImages
) => {
  axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/pending-request/image/get?id=${pendingRequestId}`
    )
    .then(function (response) {
      setDiamondImages(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const deletePendingRequestImage = async (
  imageId,
  token,
  setIsDeleted,
  toast
) => {
  setIsDeleted(true);
  await axios
    .delete(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/pending-request/image/delete?id=${imageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      setIsDeleted(false);
      toast({
        title: "Success",
        description: response.data,
        position: "top-right",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    })
    .catch((err) => {
      setIsDeleted(false);
      toast({
        title: err.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
