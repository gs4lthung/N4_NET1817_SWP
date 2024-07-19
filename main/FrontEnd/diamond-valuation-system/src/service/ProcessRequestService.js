import axios from "axios";

export const fetchProcessRequestById = async (
  id,
  setSelectedProcessRequest,
  toast
) => {
  await axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/process-request/get?id=${id}`
    )
    .then((res) => {
      console.log(res.data);
      setSelectedProcessRequest(res.data);
      return res.data; // Return the response data
    })
    .catch((err) => {
      toast({
        title: "Error",
        description: err.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};

export const updateProcessRequest = async (
  processRequestId,
  status,
  token,
  setIsUpdateProcess,
  toast
) => {
  setIsUpdateProcess(true);
  axios
    .put(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/process-request/update?id=${processRequestId}`,
      {
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      setIsUpdateProcess(false);
      toast({
        title: "Success",
        description: res.data.message,
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    })
    .catch((err) => {
      setIsUpdateProcess(false);
      toast({
        title: "Error",
        description: err.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const checkProcessRequestReceiveDate = async (
  processRequestId,
  setIsChecked,
  toast
) => {
  await axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/process-request/receive-date/check?id=${processRequestId}`
    )
    .then((res) => {
      console.log(res.data);
      if (res.status === 200) {
        if (res.data === "Canceled request") {
          setIsChecked(true);
          toast({
            title: "Success",
            description:
              "Canceled request because customer does not come to give their diamond on time to staff.",
            status: "success",
            position: "top-right",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    });
};
export const checkValuationRequestFinished = async (
  processRequestId,
  setIsChecked,
  toast
) => {
  await axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/valuation-request/process-request/check-finished?id=${processRequestId}`
    )
    .then(function (response) {
      console.log(response.data);
      if (response.status === 200) {
        if (response.data === "Finished request") {
          setIsChecked(true);
          toast({
            title: "Success",
            description:
              "Valuation request finished. Please contact customer to receive diamond.",
            status: "success",
            position: "top-right",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    })
    .catch((err) => {
      setIsChecked(false);
      toast({
        title: "Failed",
        description: err.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const checkValuationRequestSealed = async (
  processRequestId,
  setIsChecked,
  toast
) => {
  await axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/valuation-request/process-request/check-sealed?id=${processRequestId}`
    )
    .then(function (response) {
      console.log(response.data);
      if (response.status === 200) {
        if (response.data === "Sealed request") {
          setIsChecked(true);
          toast({
            title: "Success",
            description:
              "Valuation request sealed. Please contact customer to notify.",
            status: "success",
            position: "top-right",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    })
    .catch((error) => {
      toast({
        title: "Failed",
        description: error.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const fetchValuationRequestById = async (
  id,
  setSelectedValuationRequest,
  toast
) => {
  setSelectedValuationRequest(null);
  await axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/valuation-request/get?id=${id}`
    )
    .then(function (response) {
      console.log(response);
      if (response.status === 200) {
        setSelectedValuationRequest(response.data);
      }
    })
    .catch((error) => {
      toast({
        title: "Failed",
        description: error.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const fetchValuationRequestByPendingRequestId = async (
  pendingRequestId,
  setSelectedValuationRequest,
  toast
) => {
  setSelectedValuationRequest(null);
  await axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/valuation-request/pending-request/get?id=${pendingRequestId}`
    )
    .then(function (response) {
      console.log(response);
      if (response.status === 200) {
        setSelectedValuationRequest(response.data);
      }
    })
    .catch((error) => {
      toast({
        title: "Failed",
        description: error.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const fetchValuationResult = async (
  valuationRequestId,
  setSelectedValuationResult,
  toast
) => {
  setSelectedValuationResult(null);
  axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/valuation-result/valuation-request/get?id=${valuationRequestId}`
    )
    .then(function (response) {
      console.log(response.data);
      setSelectedValuationResult(response.data);
    })
    .catch((error) => {
      toast({
        title: "Failed",
        description: error.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const createSealingLetter = async (valuationRequestId, token, toast) => {
  axios
    .post(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/sealing-letter/create?valuationRequestId=${valuationRequestId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
      if (response.status === 200) {
        if (response.data.includes("successful")) {
          toast({
            title: "Success",
            description: response.data,
            position: "top-right",

            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else if (response.data.includes("already exists")) {
          toast({
            title: "Failed",
            description: response.data,
            position: "top-right",

            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    })
    .catch((error) => {
      toast({
        title: "Failed",
        description: error.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const createReceipt = async (valuationRequestId, token, toast) => {
  await axios
    .post(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/valuation-receipt/create?valuationRequestId=${valuationRequestId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
      if (response.status === 200) {
        if (response.data.includes("successful")) {
          toast({
            title: "Success",
            description: response.data,
            position: "top-right",

            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else if (response.data.includes("already exists")) {
          toast({
            title: "Failed",
            description: response.data,
            position: "top-right",

            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    })
    .catch((error) => {
      toast({
        title: "Failed",
        description: error.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const fetchValuationReceipt = async (
  valuationRequestId,
  setSelectedValuationReceipt,
  toast
) => {
  setSelectedValuationReceipt(null);
  axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/valuation-receipt/valuation-request/get?id=${valuationRequestId}`
    )
    .then(function (response) {
      console.log(response.data);
      if (response.status === 200) {
        setSelectedValuationReceipt(response.data);
      }
    })
    .catch((error) => {
      toast({
        title: "Failed",
        description: error.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const createCommitment = async (valuationRequestId, token, toast) => {
  await axios
    .post(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/commitment/manager/create?valuationRequestId=${valuationRequestId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
      if (response.status === 200) {
        if (response.data.includes("successful")) {
          toast({
            title: "Success",
            description: response.data,
            position: "top-right",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else if (response.data.includes("already exists")) {
          toast({
            title: "Failed",
            description: response.data,
            position: "top-right",

            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    })
    .catch((error) => {
      toast({
        title: "Failed",
        description: error.response.data,
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const fetchPendingRequestImagesByProcessRequestId = async (
  processRequestId,
  setDiamondImages
) => {
  await axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/pending-request/process-request/image/get?id=${processRequestId}`
    )
    .then(function (response) {
      console.log(response.data);
      if (response.status === 200) {
        setDiamondImages(response.data);
      }
    });
};
