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
  useColorModeValue,
} from "@chakra-ui/react";
import { TbPhotoCancel } from "react-icons/tb";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import routes from "../../../config/Config";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { motion } from "framer-motion";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
export default function PendingRequestTable() {
  const navigate = useNavigate();
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
  const cancelRef = useRef();
  const viewConfirmReceiveRequest = useDisclosure();
  const viewConfirmCancelRequest = useDisclosure();
  const viewConfirmDeleteImage = useDisclosure();
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
  const [selectedImage, setSelectedImages] = useState(null);
  useEffect(() => {
    fetchPendingRequest(currentPage, user.userAuth.id);
  }, [currentPage]);
  return (
    <>
      <Flex direction={"column"} gap={10} m={10}>
        <Center>
          <Text fontSize="4xl" fontWeight="bold">
            Pending Request
          </Text>
        </Center>
        {totalPages === 0 ? (
          <Center>No appointment to show</Center>
        ) : (
          <Skeleton isLoaded={pendingRequest.length > 0} height={"200px"}>
            <TableContainer
              whiteSpace={"wrap"}
              mb={5}
              p={8}
              border={"2px solid"}
              borderColor={"gray.100"}
              boxShadow="sm"
              borderRadius="24px"
              bg={useColorModeValue("white", "gray.800")}
              maxW="100%"
              minW="100%"
            >
              <Table variant={"unstyled"}>
                <Thead>
                  <Tr>
                    <Th textAlign={"center"}>No</Th>
                    <Th textAlign={"center"}>Customer</Th>
                    <Th textAlign={"center"}>Email</Th>
                    <Th textAlign={"center"}>Phone</Th>
                    <Th textAlign={"center"} w={"150px"}>Created Date</Th>
                    <Th textAlign={"center"}>Description</Th>
                    <Th textAlign={"center"}>Certificate</Th>
                    <Th textAlign={"center"}>View</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pendingRequest.map((item, index) => (
                    <Tr
                      key={index}
                      as={motion.tr}
                      whileHover={{ scale: 1.02 }}
                      transition="0.1s linear"
                      _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                    >
                      <Td>{index + 1}</Td>
                      <Td>{item?.customerName || "N/A"}</Td>
                      <Td>{item?.customerEmail || "N/A"}</Td>
                      <Td>{item?.customerPhone || "N/A"}</Td>
                      <Td>
                        {item?.createdDate
                          ? format(
                              parseISO(item?.createdDate),
                              "dd/MM/yyyy - HH:mm:ss"
                            )
                          : "N/A"}
                      </Td>
                      <Td>{item?.description || "N/A"}</Td>
                      <Td textAlign={"center"}>
                        {item?.hasCertificate ? (
                          <CheckIcon color={"green"} />
                        ) : (
                          <CloseIcon color={"red"} />
                        )}
                      </Td>
                      <Td>
                        <IconButton
                          icon={<AiOutlineFileSearch />}
                          bgColor={"transparent"}
                          color={useColorModeValue("gray.800", "gray.200")}
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
                  <Text color={"gray.600"}>Email:</Text>
                  <Text>{selectedPendingRequest?.customerEmail || "N/A"}</Text>
                </Box>
                <Box display="grid" gridTemplateColumns="150px 1fr" gap={3}>
                  <Text color={"gray.600"}>Created Date:</Text>
                  <Text>
                    {selectedPendingRequest?.createdDate
                      ? format(
                          parseISO(selectedPendingRequest?.createdDate),
                          "dd/MM/yyyy - HH:mm:ss"
                        )
                      : "N/A"}
                  </Text>
                </Box>
                <Box display="grid" gridTemplateColumns="150px 1fr" gap={3}>
                  <Text color={"gray.600"}>Description:</Text>
                  <Text>{selectedPendingRequest?.description || "N/A"}</Text>
                </Box>
                <Box display="grid" gridTemplateColumns="150px 1fr" gap={3}>
                  <Text color={"gray.600"}>Certificate:</Text>
                  <Text>{selectedPendingRequest?.hasCertificate}</Text>
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
                      w={"100px"}
                      colorScheme="red"
                      onClick={() => {
                        viewConfirmCancelRequest.onOpen();
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
                                          thumbnail().width(250).height(300)
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
                                size="sm"
                                fontSize="sm"
                                onClick={() => {
                                  setSelectedImages(image);
                                  viewConfirmDeleteImage.onOpen();
                                }}
                              >
                                <TbPhotoCancel style={{ marginRight: "5px" }} />
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
                            colorScheme="teal"
                            onClick={() => {
                              viewConfirmReceiveRequest.onOpen();
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
                            colorScheme="red"
                            onClick={() => {
                              viewConfirmCancelRequest.onOpen();
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
      <ConfirmAlert
        isOpen={viewConfirmReceiveRequest.isOpen}
        onClose={viewConfirmReceiveRequest.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={"Are you sure that want to receive this valuation request ?"}
        action={"Receive"}
        colorScheme={"teal"}
        isDelete={isReceived}
        onClickFunc={async () => {
          await receivePendingRequest(
            user?.userAuth?.id,
            selectedPendingRequest?.id,
            user.userAuth.token,
            setIsReceived,
            toast
          ).then(() => {
            setTimeout(() => {
              fetchPendingRequest(currentPage, user.userAuth.id);
              viewConfirmReceiveRequest.onClose();
              viewPendingRequest.onClose();
            }, 1000);
            setTimeout(() => {
              navigate(routes.processRequest);
            }, 1500);
          });
        }}
      />
      <ConfirmAlert
        isOpen={viewConfirmCancelRequest.isOpen}
        onClose={viewConfirmCancelRequest.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={"Are you sure that want to cancel this valuation request ?"}
        action={"Delete"}
        colorScheme={"red"}
        isDelete={isCanceled}
        onClickFunc={async () => {
          await cancelPendingRequest(
            selectedPendingRequest?.id,
            "Pending request",
            user.userAuth.token,
            setIsCanceled,
            toast
          ).then(() => {
            setTimeout(() => {
              fetchPendingRequest(currentPage, user.userAuth.id);
              viewConfirmCancelRequest.onClose();
              viewPendingRequest.onClose();
            }, 1000);
          });
        }}
      />
      <ConfirmAlert
        isOpen={viewConfirmDeleteImage.isOpen}
        onClose={viewConfirmDeleteImage.onClose}
        cancelRef={cancelRef}
        header={"Confirm"}
        body={"Are you sure that want to delete this image ?"}
        action={"Delete"}
        colorScheme={"red"}
        isDelete={isDeleted}
        onClickFunc={async () => {
          await deletePendingRequestImage(
            selectedImage,
            user.userAuth.token,
            setIsDeleted,
            toast
          ).then(() => {
            setTimeout(() => {
              fetchPendingRequest(currentPage, user.userAuth.id);
              viewConfirmDeleteImage.onClose();
              viewPendingRequest.onClose();
            }, 1000);
          });
        }}
      />
    </>
  );
}
