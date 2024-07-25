import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  IconButton,
  useDisclosure,
  useToast,
  Flex,
  Text,
  Center,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  SimpleGrid,
  Input,
  FormControl,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { PiFileTextBold } from "react-icons/pi";
import ZaloChat from "../../../components/zalo/ZaloChat";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../components/GlobalContext/AuthContext";
import { NotificationContext } from "../../../components/GlobalContext/NotificationContext";
import axios from "axios";
import PageIndicator from "../../../components/PageIndicator";
import { Link, useLocation, useNavigate } from "react-router-dom";
import routes from "../../../config/Config";
import format from "date-fns/format";
import { parseISO } from "date-fns";
import { Form, Formik } from "formik";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage, lazyload, placeholder } from "@cloudinary/react";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import {
  fetchProcessRequestById,
  updateProcessRequest,
  checkProcessRequestReceiveDate,
  checkValuationRequestFinished,
  checkValuationRequestSealed,
  fetchValuationRequestById,
  fetchValuationRequestByPendingRequestId,
  fetchValuationResult,
  createSealingLetter,
  createReceipt,
  fetchValuationReceipt,
  createCommitment,
  fetchPendingRequestImagesByProcessRequestId,
} from "../../../service/ProcessRequestService";
import ReceiptModal from "../modal/ReceiptModal";
import ValuationResultModal from "../modal/ValuationResultModal";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { motion } from "framer-motion";

export default function ProcessRequestTable() {
  const navigate = useNavigate();
  const preProcessRequestId = useLocation().state?.processRequestId;
  const toast = useToast();
  const user = useContext(UserContext);
  const { incrementNotifications } = useContext(NotificationContext);
  const isUsers =
    user.userAuth &&
    user.userAuth.authorities &&
    user.userAuth.authorities.length > 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [processRequest, setProcessRequest] = useState([]);
  const [previousStatuses, setPreviousStatuses] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [isUpdateProcess, setIsUpdateProcess] = useState(false);
  const [selectedProcessRequest, setSelectedProcessRequest] = useState(null);
  const [selectedValuationRequest, setSelectedValuationRequest] =
    useState(null);
  const [selectedValuationResult, setSelectedValuationResult] = useState(null);
  const [selectedValuationReceipt, setSelectedValuationReceipt] =
    useState(null);
  const viewValuationRequest = useDisclosure();
  const viewValuationResult = useDisclosure();
  const viewReceipt = useDisclosure();
  const fetchProcessRequest = (page, id) => {
    if (isUsers) {
      let url = "";
      if (user.userAuth.authorities[0].authority === "Manager") {
        url = `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/process-request/get/all?page=${page}`;
      } else if (
        user.userAuth.authorities[0].authority === "Consulting staff"
      ) {
        url = `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/process-request/get/consulting-staff?page=${page}&id=${id}`;
      } else if (user.userAuth.authorities[0].authority === "Customer") {
        url = `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/process-request/get/customer?page=${page}&id=${id}`;
      }
      axios
        .get(url)
        .then(function (response) {
          if (response.status === 200) {
            const newStatuses = {};
            response.data.content.forEach((item) => {
              newStatuses[item.id] = item.status;
              if (
                previousStatuses[item.id] &&
                previousStatuses[item.id] !== item.status
              ) {
                incrementNotifications();
              }
            });
            setPreviousStatuses(newStatuses);

            Promise.all(
              response.data.content.map(async (item) => {
                if (item?.status === "Not resolved yet") {
                  await checkProcessRequestReceiveDate(
                    item?.id,
                    setIsChecked,
                    toast
                  );
                }
                if (
                  item?.status !== "Finished" &&
                  item?.status !== "Done" &&
                  item?.status !== "Sealed" &&
                  item?.status !== "Lost Receipt"
                ) {
                  await checkValuationRequestFinished(
                    item?.id,
                    setIsChecked,
                    toast
                  );
                }
                if (
                  item?.status !== "Done" &&
                  item?.status !== "Sealed" &&
                  item?.status !== "Lost Receipt"
                ) {
                  await checkValuationRequestSealed(
                    item?.id,
                    setIsChecked,
                    toast
                  );
                }
              })
            );

            setProcessRequest(response.data.content);
            setTotalPages(response.data?.totalPages);
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
    }
  };
  const cancelRef = useRef();
  const viewConfirmContacted = useDisclosure();
  const viewConfirmReOpen = useDisclosure();
  const viewConfirmCancel = useDisclosure();
  const viewConfirmService = useDisclosure();
  const viewConfirmDiamondReceived = useDisclosure();
  const viewConfirmCustomerReceived = useDisclosure();
  const viewConfirmLostReceipt = useDisclosure();
  const viewConfirmSealingLetter = useDisclosure();
  const viewConfirmCommitment = useDisclosure();
  const [isCreated, setIsCreated] = useState(false);
  useEffect(() => {
    if (isChecked) {
      fetchProcessRequest(currentPage, user.userAuth.id);
      setIsChecked(false);
    }
  }, [isChecked]);
  useEffect(() => {
    fetchProcessRequest(currentPage, user.userAuth.id);
  }, [currentPage]);

  const [diamondImages, setDiamondImages] = useState([]);
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
  });
  const sortProcessRequest = [...processRequest].sort((a, b) => {
    const dateA = a.createdDate ? new Date(a.createdDate) : new Date(0);
    const dateB = b.createdDate ? new Date(b.createdDate) : new Date(0);
    return dateB - dateA;
  });
  return (
    <>
      <Flex direction={"column"} gap={10} m={10}>
        <Center>
          <Text fontSize={"4xl"} fontWeight={"bold"}>
            Process Request
          </Text>
        </Center>
        {totalPages === 0 ? (
          <Center>No process request to show</Center>
        ) : (
          <Skeleton isLoaded={processRequest.length > 0} height={"200px"}>
            <TableContainer
              whiteSpace={"wrap"}
              mb={5}
              p={8}
              border={"2px solid"}
              borderColor={"gray.100"}
              boxShadow="sm"
              borderRadius="24px"
              maxW="100%"
              minW="100%"
            >
              <Table variant={"unstyled"}>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Customer</Th>
                    <Th>Consulting Staff</Th>
                    <Th w={"150px"}>Created Date</Th>
                    <Th w={"150px"}>Receive Date</Th>
                    <Th>Description</Th>
                    <Th w={"250px"}>Status</Th>
                    <Th>View</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortProcessRequest.map((item, index) => (
                    <Tr
                      key={index}
                      as={motion.tr}
                      whileHover={{ scale: 1.02 }}
                      transition="0.1s linear"
                      bg={
                        preProcessRequestId && item?.id === preProcessRequestId
                          ? "green.100"
                          : ""
                      }
                      _hover={{
                        bg:
                          preProcessRequestId &&
                          item?.id === preProcessRequestId
                            ? "green.200"
                            : "gray.100",
                      }}
                    >
                      <Td>{item?.id}</Td>
                      <Td>{item?.customerName || "N/A"}</Td>
                      <Td>{item?.consultingStaffName}</Td>
                      <Td>
                        {item?.createdDate
                          ? format(
                              parseISO(item?.createdDate),
                              "dd/MM/yyyy - HH:mm:ss"
                            )
                          : "N/A"}
                      </Td>
                      <Td>
                        {item?.receiveDate
                          ? format(
                              parseISO(item?.receiveDate),
                              "dd/MM/yyyy - HH:mm:ss"
                            )
                          : "N/A"}
                      </Td>
                      <Td>{item?.description || "N/A"}</Td>
                      <Td>
                        <Box
                          bg={
                            (item?.status === "Not resolved yet" &&
                              "RGBA(0, 0, 0, 0.24)") ||
                            (item?.status === "Canceled" && "#F56565") ||
                            (item?.status === "Contacted" &&
                              "rgb(54, 162, 235)") ||
                            (item?.status === "Paid" && "#B794F4") ||
                            (item?.status === "Diamond Received" &&
                              "#F687B3") ||
                            (item?.status === "Valuated" && "#F6AD55") ||
                            (item?.status === "Finished" &&
                              "rgb(255, 205, 86)") ||
                            (item?.status === "Done" && "#68D391") ||
                            (item?.status === "Sealed" && "gray.300") ||
                            (item?.status === "Lost Receipt" && "#718096")
                          }
                          borderRadius={"20px"}
                          p={3}
                        >
                          <Center>{item?.status || "N/A"}</Center>
                        </Box>
                      </Td>
                      <Td>
                        <IconButton
                          icon={<PiFileTextBold />}
                          bg={"transparent"}
                          color="black"
                          onClick={() => {
                            setSelectedProcessRequest(item);
                            viewValuationRequest.onOpen();
                            fetchValuationRequestByPendingRequestId(
                              item?.pendingRequestId,
                              setSelectedValuationRequest,
                              toast
                            );
                            fetchPendingRequestImagesByProcessRequestId(
                              item?.id,
                              setDiamondImages
                            );
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Center m={"50px 0 0 0"}>
              <PageIndicator
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </Center>
          </Skeleton>
        )}
      </Flex>
      <Modal
        isOpen={viewValuationRequest.isOpen}
        onClose={viewValuationRequest.onClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Skeleton
              isLoaded={
                selectedValuationRequest !== null ||
                selectedProcessRequest?.status === "Not resolved yet" ||
                selectedProcessRequest?.status === "Contacted" ||
                selectedProcessRequest?.status === "Canceled"
              }
            >
              <ModalCloseButton />
              Details
            </Skeleton>
          </ModalHeader>
          <ModalBody>
            <Skeleton
              isLoaded={
                selectedValuationRequest !== null ||
                selectedProcessRequest?.status === "Not resolved yet" ||
                selectedProcessRequest?.status === "Contacted" ||
                selectedProcessRequest?.status === "Canceled"
              }
            >
              <Flex direction={"column"} gap={5}>
                {isUsers &&
                  (user.userAuth.authorities[0].authority === "Manager" ||
                    user.userAuth.authorities[0].authority ===
                      "Consulting staff") && (
                    <>
                      <Flex>
                        <Flex w={"50%"}>
                          <Text>
                            <strong>Customer</strong>:{" "}
                            {selectedProcessRequest?.customerName || "N/A"}
                          </Text>
                        </Flex>
                        <Text>
                          <strong>Phone</strong>:{" "}
                          {selectedProcessRequest?.customerPhone || "N/A"}
                        </Text>
                      </Flex>
                      <Text>
                        <strong>Customer Email</strong>:{" "}
                        {selectedProcessRequest?.customerEmail || "N/A"}
                      </Text>
                    </>
                  )}
                {isUsers &&
                  (user.userAuth.authorities[0].authority === "Manager" ||
                    user.userAuth.authorities[0].authority === "Customer") && (
                    <>
                      <Flex>
                        <Text w={"50%"}>
                          <strong>Staff Name: </strong>
                          {selectedProcessRequest?.consultingStaffName || "N/A"}
                        </Text>
                        <Text>
                          <strong>Phone: </strong>
                          {selectedProcessRequest?.consultingStaffPhone ||
                            "N/A"}
                        </Text>
                      </Flex>

                      <Text>
                        <strong>Staff Email: </strong>
                        {selectedProcessRequest?.consultingStaffEmail || "N/A"}
                      </Text>
                    </>
                  )}
                <Flex>
                  <Text w={"50%"}>
                    <strong>Service Type: </strong>
                    {selectedValuationRequest?.serviceName || "N/A"}
                  </Text>
                  <Text>
                    <strong>Price: </strong>
                    {selectedValuationRequest?.servicePrice || "N/A"} VND
                  </Text>
                </Flex>
                <Text>
                  <strong>Will valuate: </strong>
                  {selectedValuationRequest?.serviceStatistic || "N/A"}
                </Text>
                {/* <Text>
                  <strong>Created Date</strong>:{" "}
                  {selectedValuationRequest?.createdDate
                    ? format(
                        parseISO(selectedValuationRequest?.createdDate),
                        "dd/MM/yyyy HH:mm:ss"
                      )
                    : "N/A"}
                </Text> */}
                <Text>
                  <strong>Receive Diamond Date: </strong>
                  {selectedProcessRequest?.receiveDate
                    ? format(
                        parseISO(selectedProcessRequest?.receiveDate),
                        "dd/MM/yyyy - HH:mm:ss"
                      )
                    : " N/A"}
                </Text>
                {isUsers &&
                  user.userAuth.authorities[0].authority ===
                    "Consulting staff" &&
                  selectedProcessRequest?.status === "Not resolved yet" && (
                    <Formik
                      initialValues={{
                        receiveDate: selectedProcessRequest?.receiveDate
                          ? format(
                              parseISO(selectedProcessRequest?.receiveDate),
                              "yyyy-MM-dd HH:mm"
                            ).replace(" ", "T")
                          : " ",
                      }}
                      onSubmit={(values, { setSubmitting }) => {
                        if (
                          values.receiveDate <
                          selectedProcessRequest?.createdDate
                        ) {
                          toast({
                            title: "Failed",
                            description: "Receive date is before created date",
                            status: "warning",
                            position: "top-right",
                            duration: 3000,
                            isClosable: true,
                          });
                          setSubmitting(false);
                          return;
                        }
                        axios
                          .post(
                            `${
                              import.meta.env.VITE_REACT_APP_BASE_URL
                            }/api/process-request/receive-date/create?id=${
                              selectedProcessRequest?.id
                            }&date=${values.receiveDate}`,
                            {},
                            {
                              headers: {
                                Authorization: `Bearer ${user.userAuth.token}`,
                              },
                            }
                          )
                          .then((res) => {
                            console.log(res);
                            setSubmitting(false);
                            if (res.status === 200) {
                              if (
                                res.data ===
                                  "Receive date is after created date" ||
                                res.data.includes("Cannot")
                              ) {
                                toast({
                                  title: "Failed",
                                  description: res.data,
                                  status: "warning",
                                  position: "top-right",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              } else {
                                toast({
                                  title: "Success",
                                  description: res.data,
                                  status: "success",
                                  position: "top-right",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              }
                              viewValuationRequest.onClose();
                              setTimeout(() => {
                                fetchProcessRequest(
                                  currentPage,
                                  user.userAuth.id
                                );
                              }, 1000);
                            }
                          })
                          .catch((error) => {
                            setSubmitting(false);
                            toast({
                              title: "Failed",
                              description: error.response.data,
                              status: "error",
                              position: "top-right",
                              duration: 3000,
                              isClosable: true,
                            });
                            setTimeout(() => {
                              fetchProcessRequest(
                                currentPage,
                                user.userAuth.id
                              );
                            }, 1000);
                          });
                      }}
                    >
                      {({
                        values,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                      }) => (
                        <Form onSubmit={handleSubmit}>
                          <Flex direction={"column"}>
                            <FormControl isRequired>
                              <Input
                                name="receiveDate"
                                type="datetime-local"
                                onChange={handleChange}
                                value={values.receiveDate ?? ""}
                              />
                            </FormControl>
                            <Button
                              type="submit"
                              isLoading={isSubmitting}
                              isDisabled={isSubmitting}
                            >
                              Submit receive date
                            </Button>
                          </Flex>
                        </Form>
                      )}
                    </Formik>
                  )}
                <Flex fontWeight={"bold"}>
                  <Text minW={"180px"}>Finish Date: </Text>
                  <Text color={"green"}>
                    {selectedValuationRequest?.finishDate
                      ? format(
                          parseISO(selectedValuationRequest?.finishDate),
                          "dd/MM/yyyy - HH:mm:ss"
                        )
                      : "N/A"}
                  </Text>
                </Flex>
                <Flex fontWeight={"bold"}>
                  <Text minW={"180px"}>Sealing Date: </Text>
                  <Text color={"red.500"}>
                    {" "}
                    {selectedValuationRequest?.sealingDate
                      ? format(
                          parseISO(selectedValuationRequest?.sealingDate),
                          "dd/MM/yyyy - HH:mm:ss"
                        )
                      : "N/A"}
                  </Text>
                </Flex>
                <SimpleGrid columns={4} spacing={5}>
                  {diamondImages.map((image, index) => {
                    return (
                      <Flex direction={"column"} key={index}>
                        <Tooltip label="Click to full view" placement="top">
                          <Box
                            transition={"transform .2s"}
                            _hover={{
                              transform: "scale(1.5)",
                              boxShadow: "0 0 2px 1px rgba(0, 140, 186, 0.5)",
                            }}
                            onClick={() => {
                              window.open(cld.image(image).toURL(), "_blank");
                            }}
                          >
                            <AdvancedImage
                              cldImg={cld
                                .image(image)
                                .resize(thumbnail().width(200).height(200))}
                              plugins={[
                                lazyload(),
                                placeholder({ mode: "blur" }),
                              ]}
                            />
                          </Box>
                        </Tooltip>
                      </Flex>
                    );
                  })}
                </SimpleGrid>
                {selectedProcessRequest?.status === "Canceled" && (
                  <Center>
                    <Flex direction={"column"} align={"center"} p={10} gap={5}>
                      <Text textTransform={"uppercase"} color={"tomato"}>
                        The request has been canceled
                      </Text>
                      <Text>
                        Please contact with{" "}
                        {(user.userAuth.authorities[0].authority ===
                          "Consulting staff" &&
                          "customer") ||
                          (user.userAuth.authorities[0].authority ===
                            "Customer" &&
                            "staff")}
                      </Text>
                    </Flex>
                  </Center>
                )}
              </Flex>
            </Skeleton>
          </ModalBody>
          <Skeleton
            isLoaded={
              selectedValuationRequest !== null ||
              selectedProcessRequest?.status === "Not resolved yet" ||
              selectedProcessRequest?.status === "Contacted" ||
              selectedProcessRequest?.status === "Canceled"
            }
          >
            {(isUsers &&
              user.userAuth.authorities[0].authority === "Manager" && (
                <ModalFooter justifyContent={"space-around"}>
                  {(selectedProcessRequest?.status === "Sealed" && (
                    <Button
                      onClick={() => {
                        viewConfirmSealingLetter.onOpen();
                      }}
                    >
                      Create sealing letter
                    </Button>
                  )) ||
                    (selectedProcessRequest?.status === "Lost Receipt" && (
                      <Button
                        onClick={() => {
                          viewConfirmCommitment.onOpen();
                        }}
                      >
                        Create commitment letter
                      </Button>
                    ))}
                </ModalFooter>
              )) ||
              (isUsers &&
                user.userAuth.authorities[0].authority ===
                  "Consulting staff" && (
                  <ModalFooter justifyContent={"space-around"}>
                    {selectedProcessRequest?.status === "Not resolved yet" && (
                      <>
                        <Button onClick={viewConfirmContacted.onOpen}>
                          Contacted
                        </Button>
                      </>
                    )}
                    {(selectedProcessRequest?.status === "Contacted" ||
                      selectedProcessRequest?.status ===
                        "Not resolved yet") && (
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          viewConfirmCancel.onOpen();
                        }}
                      >
                        Cancel
                      </Button>
                    )}

                    {selectedProcessRequest?.status === "Canceled" && (
                      <Button
                        colorScheme="teal"
                        onClick={() => {
                          viewConfirmReOpen.onOpen();
                        }}
                      >
                        Re-open
                      </Button>
                    )}
                    {selectedProcessRequest?.status === "Paid" && (
                      <Button
                        onClick={() => {
                          viewConfirmDiamondReceived.onOpen();
                        }}
                      >
                        Diamond Received
                      </Button>
                    )}
                    {selectedProcessRequest?.status === "Diamond Received" && (
                      <Button
                        onClick={() => {
                          viewReceipt.onOpen();
                          fetchValuationReceipt(
                            selectedValuationRequest?.id,
                            setSelectedValuationReceipt,
                            toast
                          );
                        }}
                      >
                        Receipt
                      </Button>
                    )}
                    {(selectedProcessRequest?.status === "Valuated" ||
                      selectedProcessRequest?.status === "Finished" ||
                      selectedProcessRequest?.status === "Sealed" ||
                      selectedProcessRequest?.status === "Lost Receipt" ||
                      selectedProcessRequest?.status === "Done") && (
                      <Button
                        colorScheme="teal"
                        onClick={() => {
                          fetchValuationResult(
                            selectedValuationRequest?.id,
                            setSelectedValuationResult,
                            toast
                          );
                          viewValuationResult.onOpen();
                        }}
                      >
                        View
                      </Button>
                    )}
                    {(selectedProcessRequest?.status === "Finished" ||
                      selectedProcessRequest?.status === "Sealed" ||
                      selectedProcessRequest?.status === "Lost Receipt") && (
                      <Button
                        colorScheme="blue"
                        onClick={() => {
                          viewConfirmCustomerReceived.onOpen();
                        }}
                      >
                        Cust. Received
                      </Button>
                    )}
                    {(selectedProcessRequest?.status === "Finished" ||
                      selectedProcessRequest?.status === "Sealed") && (
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          viewConfirmLostReceipt.onOpen();
                        }}
                      >
                        Lost Receipt
                      </Button>
                    )}
                    <ZaloChat
                      phone={selectedProcessRequest?.customerPhone}
                      type={"customer"}
                    />
                  </ModalFooter>
                )) ||
              (isUsers &&
                user.userAuth.authorities[0].authority === "Customer" && (
                  <ModalFooter justifyContent={"space-around"}>
                    {(selectedProcessRequest?.status === "Contacted" && (
                      <>
                        <Button
                          colorScheme="teal"
                          onClick={() => {
                            viewConfirmService.onOpen();
                          }}
                        >
                          Service
                        </Button>
                      </>
                    )) ||
                      ((selectedProcessRequest?.status === "Valuated" ||
                        selectedProcessRequest?.status === "Finished" ||
                        selectedProcessRequest?.status === "Done" ||
                        selectedProcessRequest?.status === "Sealed") && (
                        <>
                          <Button
                            colorScheme="teal"
                            onClick={() => {
                              viewValuationResult.onOpen();
                              fetchValuationResult(
                                selectedValuationRequest?.id,
                                setSelectedValuationResult,
                                toast
                              );
                            }}
                          >
                            View Result
                          </Button>
                        </>
                      ))}
                    <ZaloChat
                      phone={selectedProcessRequest?.consultingStaffPhone}
                      type={"staff"}
                    />
                  </ModalFooter>
                ))}
          </Skeleton>
        </ModalContent>
      </Modal>
      <ValuationResultModal
        viewValuationResult={viewValuationResult}
        selectedValuationResult={selectedValuationResult}
      />
      <ReceiptModal
        viewReceipt={viewReceipt}
        selectedValuationReceipt={selectedValuationReceipt}
      />
      <ConfirmAlert
        isOpen={viewConfirmContacted.isOpen}
        onClose={viewConfirmContacted.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={
          "Are you sure that customer has been contacted and ready to paid for service ?"
        }
        action={"Contacted"}
        colorScheme={"teal"}
        isDelete={isUpdateProcess}
        onClickFunc={async () => {
          if (selectedProcessRequest?.receiveDate !== null) {
            await updateProcessRequest(
              selectedProcessRequest?.id,
              "Contacted",
              user.userAuth.token,
              setIsUpdateProcess,
              toast
            ).then(() => {
              setTimeout(() => {
                fetchProcessRequest(currentPage, user.userAuth.id);
                viewConfirmContacted.onClose();
                viewValuationRequest.onClose();
              }, 1000);
            });
          } else {
            toast({
              title: "Failed",
              description: "Please set receive date first",
              status: "warning",
              position: "top-right",
              duration: 3000,
              isClosable: true,
            });
            viewConfirmContacted.onClose();
          }
        }}
      />
      <ConfirmAlert
        isOpen={viewConfirmReOpen.isOpen}
        onClose={viewConfirmReOpen.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={
          "Are you sure that re-open the request after the customer doesn't come to send their diamond on time ?"
        }
        action={"Re-open"}
        colorScheme={"teal"}
        isDelete={isUpdateProcess}
        onClickFunc={async () => {
          await updateProcessRequest(
            selectedProcessRequest?.id,
            "Re-open",
            user.userAuth.token,
            setIsUpdateProcess,
            toast
          ).then(() => {
            setTimeout(() => {
              fetchProcessRequest(currentPage, user.userAuth.id);
              viewConfirmReOpen.onClose();
              viewValuationRequest.onClose();
            }, 1000);
          });
        }}
      />
      <ConfirmAlert
        isOpen={viewConfirmCancel.isOpen}
        onClose={viewConfirmCancel.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={"Are you sure that cancel the customer is request ?"}
        action={"Delete"}
        colorScheme={"red"}
        isDelete={isUpdateProcess}
        onClickFunc={async () => {
          await updateProcessRequest(
            selectedProcessRequest?.id,
            "Canceled",
            user.userAuth.token,
            setIsUpdateProcess,
            toast
          ).then(() => {
            setTimeout(() => {
              fetchProcessRequest(currentPage, user.userAuth.id);
              viewConfirmCancel.onClose();
              viewValuationRequest.onClose();
            }, 1000);
          });
        }}
      />
      <ConfirmAlert
        isOpen={viewConfirmService.isOpen}
        onClose={viewConfirmService.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={"Are you sure that choose and pay for a valuation service ?"}
        action={"Choose Service"}
        colorScheme={"teal"}
        isDelete={isUpdateProcess}
        onClickFunc={() => {
          navigate(routes.diamondService, {
            state: {
              pendingRequestId: selectedProcessRequest?.pendingRequestId,
            },
          });
        }}
      />
      <ConfirmAlert
        isOpen={viewConfirmDiamondReceived.isOpen}
        onClose={viewConfirmDiamondReceived.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={"Are you sure that has received diamond from customer ?"}
        action={"Diamond Received"}
        colorScheme={"teal"}
        isDelete={isUpdateProcess}
        onClickFunc={async () => {
          await updateProcessRequest(
            selectedProcessRequest?.id,
            "Diamond Received",
            user.userAuth.token,
            setIsUpdateProcess,
            toast
          ).then(() => {
            createReceipt(
              selectedValuationRequest?.id,
              user.userAuth.token,
              toast
            );
            setTimeout(() => {
              fetchProcessRequest(currentPage, user.userAuth.id);
              viewConfirmDiamondReceived.onClose();
              viewValuationRequest.onClose();
            }, 1000);
          });
        }}
      />
      <ConfirmAlert
        isOpen={viewConfirmCustomerReceived.isOpen}
        onClose={viewConfirmCustomerReceived.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={
          "Are you sure that customer has came and received their diamond back after valuation ?"
        }
        action={"Customer Received"}
        colorScheme={"teal"}
        isDelete={isUpdateProcess}
        onClickFunc={async () => {
          await updateProcessRequest(
            selectedProcessRequest?.id,
            "Done",
            user.userAuth.token,
            setIsUpdateProcess,
            toast
          ).then(() => {
            setTimeout(() => {
              fetchProcessRequest(currentPage, user.userAuth.id);
              viewConfirmCustomerReceived.onClose();
              viewValuationRequest.onClose();
            }, 1000);
          });
        }}
      />
      <ConfirmAlert
        isOpen={viewConfirmLostReceipt.isOpen}
        onClose={viewConfirmLostReceipt.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={
          "Are you sure that customer has lost their receipt for receiving their diamond back ?"
        }
        action={"Lost Receipt"}
        colorScheme={"teal"}
        isDelete={isUpdateProcess}
        onClickFunc={async () => {
          await updateProcessRequest(
            selectedProcessRequest?.id,
            "Lost Receipt",
            user.userAuth.token,
            setIsUpdateProcess,
            toast
          ).then(() => {
            setTimeout(() => {
              fetchProcessRequest(currentPage, user.userAuth.id);
              viewConfirmLostReceipt.onClose();
              viewValuationRequest.onClose();
            }, 1000);
          });
        }}
      />
      <ConfirmAlert
        isOpen={viewConfirmSealingLetter.isOpen}
        onClose={viewConfirmSealingLetter.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={
          "Are you sure that create a sealing letter when customer doesn't come to get their diamond back ?"
        }
        action={"Create"}
        colorScheme={"teal"}
        isDelete={isCreated}
        onClickFunc={async () => {
          await createSealingLetter(
            selectedValuationRequest?.id,
            setIsCreated,
            user.userAuth.token,
            toast
          ).then(() => {
            setTimeout(() => {
              fetchProcessRequest(currentPage, user.userAuth.id);
              viewConfirmSealingLetter.onClose();
              viewValuationRequest.onClose();
            }, 1000);
          });
        }}
      />
      <ConfirmAlert
        isOpen={viewConfirmCommitment.isOpen}
        onClose={viewConfirmCommitment.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={
          "Are you sure that create a commitment letter when customer lost their receipt ?"
        }
        action={"Create"}
        colorScheme={"teal"}
        isDelete={isCreated}
        onClickFunc={async () => {
          await createCommitment(
            selectedValuationRequest?.id,
            setIsCreated,
            user.userAuth.token,
            toast
          ).then(() => {
            setTimeout(() => {
              fetchProcessRequest(currentPage, user.userAuth.id);
              viewConfirmCommitment.onClose();
              viewValuationRequest.onClose();
            }, 1000);
          });
        }}
      />
    </>
  );
}
