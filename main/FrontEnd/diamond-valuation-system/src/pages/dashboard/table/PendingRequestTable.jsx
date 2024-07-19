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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
  Text,
  Button,
  ModalFooter,
  useToast,
  Box,
  Center,
  Skeleton,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../components/GlobalContext/AuthContext";
import axios from "axios";
import PageIndicator from "../../../components/PageIndicator";
import UploadImage from "../../../components/UploadImage";
import { AdvancedImage, lazyload, placeholder } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import {
  receivePendingRequest,
  cancelPendingRequest,
  fetchPendingRequestImages,
  deletePendingRequestImage,
} from "../../../service/PendingRequestService";
import { deleteCloudinaryImage } from "../../../service/CloudinaryService";
import { format, parseISO } from "date-fns";
import { AiOutlineFileSearch } from "react-icons/ai";
import ZaloChat from "../../../components/zalo/ZaloChat";
export default function PendingRequestTable() {
  const toast = useToast();
  const user = useContext(UserContext);
  const isUsers =
    user.userAuth &&
    user.userAuth.authorities &&
    user.userAuth.authorities.length > 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const viewPendingRequest = useDisclosure();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isReceived, setIsReceived] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [selectedPendingRequest, setSelectedPendingRequest] = useState(null);
  const fetchPendingRequest = (page, id) => {
    if (isUsers) {
      let url = "";
      if (
        user.userAuth.authorities[0].authority === "Consulting staff" ||
        user.userAuth.authorities[0].authority === "Manager"
      ) {
        url = `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/pending-request/get/all?page=${page}`;
      } else if (user.userAuth.authorities[0].authority === "Customer") {
        url = `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/pending-request/customer/get?page=${page}&id=${id}`;
      }
      axios.get(url).then(function (response) {
        console.log(response);
        if (response.status === 200) {
          setPendingRequest(response.data.content);
          setTotalPages(response.data?.totalPages);
        }
      });
    }
  };

  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
  });
  const [diamondImages, setDiamondImages] = useState([]);
  useEffect(() => {
    fetchPendingRequest(currentPage, user.userAuth.id);
  }, [currentPage]);
  return (
    <>
      <Flex direction={"column"} gap={10}>
        <Center>
          <Text fontSize="4xl" fontWeight="bold">
            Appointments
          </Text>
        </Center>
        {totalPages === 0 ? (
          <Center>No appointment to show</Center>
        ) : (
          <Skeleton isLoaded={pendingRequest.length > 0} height={"200px"}>
            <TableContainer shadow="md" borderRadius="md">
              <Table>
                <Thead
                  bg="gray.600"
                  mb={5}
                  boxShadow="sm"
                  borderRadius="md"
                  maxW="100%"
                  minW="100%"
                >
                  <Tr>
                    <Th color="white">No</Th>
                    <Th color="white">Customer</Th>
                    <Th color="white">Email</Th>
                    <Th color="white">Phone</Th>
                    <Th color="white">Description</Th>
                    <Th color="white">Created Date</Th>
                    <Th color="white">View</Th>
                  </Tr>
                </Thead>
                <Tbody variant="simple" bg="gray.200" color="black">
                  {pendingRequest.map((item, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{item?.customerName || "N/A"}</Td>
                      <Td>{item?.customerEmail || "N/A"}</Td>
                      <Td>{item?.customerPhone || "N/A"}</Td>
                      <Td>{item?.description || "N/A"}</Td>
                      <Td>
                        {item?.createdDate
                          ? format(
                              parseISO(item?.createdDate),
                              "dd/MM/yyyy HH:mm:ss"
                            )
                          : "N/A"}
                      </Td>
                      <Td>
                        <IconButton
                          icon={<AiOutlineFileSearch />}
                          bgColor={"transparent"}
                          color="black"
                          onClick={() => {
                            setSelectedPendingRequest(item);
                            fetchPendingRequestImages(
                              item?.id,
                              setDiamondImages
                            );
                            viewPendingRequest.onOpen();
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
        isOpen={viewPendingRequest.isOpen}
        onClose={viewPendingRequest.onClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Skeleton isLoaded={selectedPendingRequest !== null}>
              Pending Request ID: {selectedPendingRequest?.id || "N/A"}
            </Skeleton>
          </ModalHeader>
          <ModalBody>
            <Skeleton isLoaded={selectedPendingRequest !== null}>
              <Flex
                direction={"column"}
                gap={5}
                p={5}
                borderRadius="md"
                fontWeight="bold"
              >
                <Box display="grid" gridTemplateColumns="150px 1fr" gap={3}>
                  <Text color={"gray.600"}>Customer:</Text>
                  <Text textTransform="uppercase">
                    {selectedPendingRequest?.customerName || "N/A"}
                  </Text>
                </Box>
                <Box display="grid" gridTemplateColumns="150px 1fr" gap={3}>
                  <Text color={"gray.600"}>Phone:</Text>
                  <Text>{selectedPendingRequest?.customerPhone || "N/A"}</Text>
                </Box>
                <Box display="grid" gridTemplateColumns="150px 1fr" gap={3}>
                  <Text color={"gray.600"}>Description:</Text>
                  <Text>{selectedPendingRequest?.description || "N/A"}</Text>
                </Box>
                <Box display="grid" gridTemplateColumns="150px 1fr" gap={3}>
                  <Text color={"gray.600"}>Email:</Text>
                  <Text>{selectedPendingRequest?.customerEmail || "N/A"}</Text>
                </Box>
                <Box display="grid" gridTemplateColumns="150px 1fr" gap={3}>
                  <Text color={"gray.600"}>Created Date:</Text>
                  <Text>
                    {selectedPendingRequest?.createdDate?.slice(0, 10) || "N/A"}
                  </Text>
                </Box>
              </Flex>
            </Skeleton>
          </ModalBody>
          <Skeleton isLoaded={selectedPendingRequest !== null}>
            {(isUsers &&
              user.userAuth.authorities[0].authority === "Customer" && (
                <ModalFooter justifyContent={"space-around"}>
                  <Flex direction={"column"} gap={5} align={"center"}>
                    <Button
                      isLoading={isCanceled}
                      isDisabled={isCanceled}
                      w={"100px"}
                      colorScheme="red"
                      onClick={async () => {
                        await cancelPendingRequest(
                          selectedPendingRequest?.id,
                          "Pending request",
                          user.userAuth.token,
                          setIsCanceled,
                          toast
                        ).then(() => {
                          setTimeout(() => {
                            fetchPendingRequest(currentPage, user.userAuth.id);
                            viewPendingRequest.onClose();
                          }, 1000);
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <SimpleGrid columns={4} spacing={5}>
                      {diamondImages?.map((image, index) => {
                        return (
                          <>
                            <Flex direction={"column"} key={index}>
                              {isDeleted === false && (
                                <Tooltip
                                  label="Click to full view"
                                  placement="top"
                                >
                                  <Box
                                    transition={"transform .2s"}
                                    _hover={{
                                      transform: "scale(1.5)",
                                      boxShadow:
                                        "0 0 2px 1px rgba(0, 140, 186, 0.5)",
                                    }}
                                    onClick={() => {
                                      window.open(
                                        cld.image(image).toURL(),
                                        "_blank"
                                      );
                                    }}
                                  >
                                    <AdvancedImage
                                      cldImg={cld
                                        .image(image)
                                        .resize(
                                          thumbnail().width(200).height(200)
                                        )}
                                      plugins={[
                                        lazyload(),
                                        placeholder({ mode: "blur" }),
                                      ]}
                                    />
                                  </Box>
                                </Tooltip>
                              )}

                              <Button
                                colorScheme="red"
                                isDisabled={isDeleted}
                                isLoading={isDeleted}
                                onClick={async () => {
                                  await deletePendingRequestImage(
                                    image,
                                    user.userAuth.token,
                                    setIsDeleted,
                                    toast
                                  ).then(() => {
                                    setTimeout(() => {
                                      fetchPendingRequest(
                                        currentPage,
                                        user.userAuth.id
                                      );
                                      viewPendingRequest.onClose();
                                    }, 1000);
                                  });
                                }}
                              >
                                Delete
                              </Button>
                            </Flex>
                          </>
                        );
                      })}
                    </SimpleGrid>
                    <Text color={"gray"}>
                      Please upload your diamond images for us
                    </Text>
                    <UploadImage
                      diamondId={selectedPendingRequest?.id}
                      type={"pending_request"}
                    />
                  </Flex>
                </ModalFooter>
              )) ||
              (isUsers &&
                user.userAuth.authorities[0].authority ===
                  "Consulting staff" && (
                  <ModalFooter justifyContent={"space-around"}>
                    <Flex direction={"column"} gap={5}>
                      <Flex justify={"space-around"} gap={10}>
                        <Tooltip
                          label="Please contact with customer after receive their request"
                          placement="top"
                          hasArrow
                        >
                          <Button
                            isLoading={isReceived}
                            isDisabled={isReceived}
                            colorScheme="teal"
                            onClick={async () => {
                              await receivePendingRequest(
                                user?.userAuth?.id,
                                selectedPendingRequest?.id,
                                user.userAuth.token,
                                setIsReceived,
                                toast
                              ).then(() => {
                                setTimeout(() => {
                                  fetchPendingRequest(
                                    currentPage,
                                    user.userAuth.id
                                  );
                                  viewPendingRequest.onClose();
                                }, 1000);
                              });
                            }}
                          >
                            Receive
                          </Button>
                        </Tooltip>
                        <ZaloChat
                          type={"customer"}
                          phone={selectedPendingRequest?.customerPhone}
                        />
                        <Tooltip
                          label="Please contact with customer after cancel their request"
                          placement="top"
                          hasArrow
                        >
                          <Button
                            isLoading={isCanceled}
                            isDisabled={isCanceled}
                            colorScheme="red"
                            onClick={async () => {
                              await cancelPendingRequest(
                                selectedPendingRequest?.id,
                                "Pending request",
                                user.userAuth.token,
                                setIsCanceled,
                                toast
                              ).then(() => {
                                setTimeout(() => {
                                  fetchPendingRequest(
                                    currentPage,
                                    user.userAuth.id
                                  );
                                  viewPendingRequest.onClose();
                                }, 1000);
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </Tooltip>
                      </Flex>
                      <SimpleGrid columns={4} spacing={5}>
                        {diamondImages?.map((image, index) => {
                          return (
                            <>
                              <Flex direction={"column"} key={index}>
                                <Tooltip
                                  label="Click to full view"
                                  placement="top"
                                >
                                  <Box
                                    transition={"transform .2s"}
                                    _hover={{
                                      transform: "scale(1.5)",
                                      boxShadow:
                                        "0 0 2px 1px rgba(0, 140, 186, 0.5)",
                                    }}
                                    onClick={() => {
                                      window.open(
                                        cld.image(image).toURL(),
                                        "_blank"
                                      );
                                    }}
                                  >
                                    <AdvancedImage
                                      cldImg={cld
                                        .image(image)
                                        .resize(
                                          thumbnail().width(200).height(200)
                                        )}
                                      plugins={[
                                        lazyload(),
                                        placeholder({ mode: "blur" }),
                                      ]}
                                    />
                                  </Box>
                                </Tooltip>
                              </Flex>
                            </>
                          );
                        })}
                      </SimpleGrid>
                    </Flex>
                  </ModalFooter>
                ))}
          </Skeleton>
        </ModalContent>
      </Modal>
    </>
  );
}
