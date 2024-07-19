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
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../components/GlobalContext/AuthContext";
import axios from "axios";
import PageIndicator from "../../../components/PageIndicator";
import { Link, useLocation } from "react-router-dom";
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
export default function ProcessRequestTable() {
  const preProcessRequestId = useLocation().state?.processRequestId;
  const toast = useToast();
  const user = useContext(UserContext);
  const isUsers =
    user.userAuth &&
    user.userAuth.authorities &&
    user.userAuth.authorities.length > 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [processRequest, setProcessRequest] = useState([]);
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
          console.log(response.data);
          if (response.status === 200) {
            Promise.all(
              response.data.content.map(async (item, index) => {
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
      <Flex direction={"column"} gap={10}>
        <Center>
          <Text fontSize={"4xl"} fontWeight={"bold"}>
            Process Request
          </Text>
        </Center>
        {totalPages === 0 ? (
          <Center>No process request to show</Center>
        ) : (
          <Skeleton isLoaded={processRequest.length > 0} height={"200px"}>
            <TableContainer shadow="md" borderRadius="md">
              <Table>
                <Thead
                  bg="gray.600"
                  color="white"
                  mb={5}
                  boxShadow="sm"
                  borderRadius="md"
                  maxW="100%"
                  minW="100%"
                >
                  <Tr>
                    <Th color="white">No</Th>
                    <Th color="white">ID</Th>
                    {(user.userAuth.roleid === 2 ||
                      user.userAuth.roleid === 3) && (
                      <Th color="white">Customer ID</Th>
                    )}
                    <Th color="white">Customer</Th>
                    {(user.userAuth.roleid === 2 ||
                      user.userAuth.roleid === 3) && (
                      <Th color="white">Consulting Staff ID</Th>
                    )}
                    <Th color="white">Consulting Staff Name</Th>
                    <Th color={"white"}>Created Date</Th>
                    <Th color={"white"}>Receive Date</Th>
                    <Th color="white">Description</Th>
                    <Th color="white">Status</Th>
                    <Th color="white">View</Th>
                  </Tr>
                </Thead>
                <Tbody variant="simple" bg="gray.200" color="black">
                  {sortProcessRequest.map((item, index) => (
                    <Tr
                      key={index}
                      bg={
                        preProcessRequestId && item?.id === preProcessRequestId
                          ? "green.100"
                          : "gray.200"
                      }
                      _hover={{
                        bg:
                          preProcessRequestId &&
                          item?.id === preProcessRequestId
                            ? "green.200"
                            : "gray.100",
                      }}
                    >
                      <Td>{index + 1}</Td>
                      <Td>{item?.id}</Td>
                      {(user.userAuth.roleid === 2 ||
                        user.userAuth.roleid === 3) && (
                        <Td>{item?.customerId || "N/A"}</Td>
                      )}
                      <Td>{item?.customerName || "N/A"}</Td>
                      {(user.userAuth.roleid === 2 ||
                        user.userAuth.roleid === 3) && (
                        <Td>{item?.consultingStaffId || "N/A"}</Td>
                      )}
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
                      <Td>{item?.status || "N/A"}</Td>
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
              Valuation Request ID:{" "}
              {selectedProcessRequest?.pendingRequestId || "N/A"}
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
                            toast({
                              title: "Success",
                              description: res.data,
                              status: "success",
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
                        Your request has been canceled because you didn't send
                        your diamond to us on time.
                      </Text>
                      <Text>
                        Please contact with our staff for more information
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
                        createSealingLetter(
                          selectedValuationRequest?.id,
                          user.userAuth.token,
                          toast
                        );
                      }}
                    >
                      Create sealing letter
                    </Button>
                  )) ||
                    (selectedProcessRequest?.status === "Lost Receipt" && (
                      <Button
                        onClick={() => {
                          createCommitment(
                            selectedValuationRequest?.id,
                            user.userAuth.token,
                            toast
                          );
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
                    {(selectedProcessRequest?.status === "Not resolved yet" && (
                      <>
                        <Button
                          isLoading={isUpdateProcess}
                          onClick={async () => {
                            await updateProcessRequest(
                              selectedProcessRequest?.id,
                              "Contacted",
                              user.userAuth.token,
                              setIsUpdateProcess,
                              toast
                            ).then(() => {
                              setTimeout(() => {
                                fetchProcessRequest(
                                  currentPage,
                                  user.userAuth.id
                                );
                                viewValuationRequest.onClose();
                              }, 1000);
                            });
                          }}
                        >
                          Contacted
                        </Button>
                        <ZaloChat
                          phone={selectedProcessRequest?.customerPhone}
                          type={"customer"}
                        />
                      </>
                    )) ||
                      ((selectedProcessRequest?.status === "Contacted" ||
                        selectedProcessRequest?.status === "Canceled") && (
                        <ZaloChat
                          phone={selectedProcessRequest?.customerPhone}
                          type={"customer"}
                        />
                      )) ||
                      (selectedProcessRequest?.status === "Paid" && (
                        <>
                          <Button
                            isLoading={isUpdateProcess}
                            onClick={async () => {
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
                                  fetchProcessRequest(
                                    currentPage,
                                    user.userAuth.id
                                  );
                                  viewValuationRequest.onClose();
                                }, 1000);
                              });
                            }}
                          >
                            Diamond Received
                          </Button>
                          <ZaloChat
                            phone={selectedProcessRequest?.customerPhone}
                            type={"customer"}
                          />
                        </>
                      )) ||
                      (selectedProcessRequest?.status ===
                        "Diamond Received" && (
                        <>
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
                          <ZaloChat
                            phone={selectedProcessRequest?.customerPhone}
                            type={"customer"}
                          />
                        </>
                      )) ||
                      (selectedProcessRequest?.status === "Valuated" && (
                        <>
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
                          <ZaloChat
                            phone={selectedProcessRequest?.customerPhone}
                            type={"customer"}
                          />
                        </>
                      )) ||
                      ((selectedProcessRequest?.status === "Finished" ||
                        selectedProcessRequest?.status === "Sealed" ||
                        selectedProcessRequest?.status === "Lost Receipt") && (
                        <>
                          <SimpleGrid columns={2} spacing={5}>
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
                            <ZaloChat
                              phone={selectedProcessRequest?.customerPhone}
                              type={"customer"}
                            />
                            <Button
                              isLoading={isUpdateProcess}
                              colorScheme="blue"
                              onClick={async () => {
                                await updateProcessRequest(
                                  selectedProcessRequest?.id,
                                  "Done",
                                  user.userAuth.token,
                                  setIsUpdateProcess,
                                  toast
                                ).then(() => {
                                  setTimeout(() => {
                                    fetchProcessRequest(
                                      currentPage,
                                      user.userAuth.id
                                    );
                                    viewValuationRequest.onClose();
                                  }, 1000);
                                });
                              }}
                            >
                              Cust. Received
                            </Button>
                            {selectedProcessRequest?.status !==
                              "Lost Receipt" && (
                              <Button
                                colorScheme="red"
                                onClick={async () => {
                                  await updateProcessRequest(
                                    selectedProcessRequest?.id,
                                    "Lost Receipt",
                                    user.userAuth.token,
                                    setIsUpdateProcess,
                                    toast
                                  ).then(() => {
                                    setTimeout(() => {
                                      fetchProcessRequest(
                                        currentPage,
                                        user.userAuth.id
                                      );
                                      viewValuationRequest.onClose();
                                    }, 1000);
                                  });
                                }}
                              >
                                Lost Receipt
                              </Button>
                            )}
                          </SimpleGrid>
                        </>
                      )) ||
                      (selectedProcessRequest?.status === "Done" && (
                        <>
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
                          <ZaloChat
                            phone={selectedProcessRequest?.customerPhone}
                            type={"customer"}
                          />
                        </>
                      ))}
                  </ModalFooter>
                )) ||
              (isUsers &&
                user.userAuth.authorities[0].authority === "Customer" && (
                  <ModalFooter justifyContent={"space-around"}>
                    {((selectedProcessRequest?.status === "Not resolved yet" ||
                      selectedProcessRequest?.status === "Canceled") && (
                      <ZaloChat
                        phone={selectedProcessRequest?.consultingStaffPhone}
                        type={"staff"}
                      />
                    )) ||
                      (selectedProcessRequest?.status === "Contacted" && (
                        <>
                          <Link
                            to={routes.diamondService}
                            state={{
                              pendingRequestId:
                                selectedProcessRequest?.pendingRequestId,
                            }}
                          >
                            <Button colorScheme="teal">Service</Button>
                          </Link>
                          <ZaloChat
                            phone={selectedProcessRequest?.consultingStaffPhone}
                            type={"staff"}
                          />
                        </>
                      )) ||
                      (selectedProcessRequest?.status === "Paid" && (
                        <ZaloChat
                          phone={selectedProcessRequest?.consultingStaffPhone}
                          type={"staff"}
                        />
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
                          <ZaloChat
                            phone={selectedProcessRequest?.consultingStaffPhone}
                            type={"staff"}
                          />
                        </>
                      ))}
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
    </>
  );
}
