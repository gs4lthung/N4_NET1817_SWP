import {
  Divider,
  Flex,
  FormControl,
  Center,
  Textarea,
  useColorModeValue,
  Button,
  useToast,
  FormLabel,
  Input,
  Image,
  Icon,
  Text,
  SimpleGrid,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  IconButton,
  Tooltip,
  Checkbox,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import Title from "../../components/Title";
import { Form, Formik } from "formik";
import axios from "axios";
import { UserContext } from "../../components/GlobalContext/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import routes from "../../config/Config";
import { LuUpload } from "react-icons/lu";
import { GrUpdate } from "react-icons/gr";

export default function DiamondValuationRequest() {
  const user = useContext(UserContext);
  const isUsers =
    user.userAuth &&
    user.userAuth.authorities &&
    user.userAuth.authorities.length > 0;
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUpLoading] = useState(false);
  const bgColor = useColorModeValue("white", "black");
  const bgColor1 = useColorModeValue("blue.400", "yellow.500");
  const toast = useToast();
  const navigate = useNavigate();
  const createPendingRequest = async (
    customerId,
    description,
    token,
    hasCertificate
  ) => {
    await axios
      .post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/pending-request/create`,
        {
          customerId: customerId,
          description: description,
          hasCertificate: hasCertificate,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(function (response) {
        if (response.status === 200) {
          handleSubmitImages(response.data.id);
        }
      });
  };
  const checkCustomerPendingRequest = async (
    customerId,
    description,
    hasCertificate
  ) => {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/pending-request/customer/check?id=${customerId}`
      )
      .then(function (response) {
        if (response.data.includes("already")) {
          toast({
            title: response.data,
            position: "top-right",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        } else {
          createPendingRequest(
            customerId,
            description,
            user.userAuth.token,
            hasCertificate
          );
        }
      });
  };
  const handleSubmitImages = async (pendingRequestId) => {
    try {
      for (const image of selectedImages) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        formData.append("public_id", uuidv4());
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (res) {
          const data = await res.json();
          axios.post(
            `${
              import.meta.env.VITE_REACT_APP_BASE_URL
            }/api/pending-request/image/create`,
            {
              id: data.public_id,
              pendingRequestId: pendingRequestId,
            },
            {
              headers: {
                Authorization: `Bearer ${user.userAuth.token}`,
              },
            }
          );
        }
      }
      toast({
        title: "Request submitted successfully",
        position: "top-right",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(routes.pendingRequest);
    } catch (error) {
      toast({
        title: "Error",
        position: "top-right",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Flex
        direction={"column"}
        minH={"100vh"}
        alignItems={"center"}
        bg={bgColor}
        pt={"20px"}
      >
        <Flex
          direction={"column"}
          p={8}
          border={"1px solid"}
          borderColor={bgColor1}
          borderRadius={"24px"}
          m={"10px"}
          gap={10}
        >
          <Title
            title={"Diamond Valuation Request"}
            description={
              "Please fill in the form below to request a diamond valuation."
            }
            width={"50vw"}
          />
          <Flex direction={"column"} align={"start"} gap={5}>
            <InputGroup>

              <InputLeftAddon color={bgColor} bgColor={bgColor1}>Name</InputLeftAddon>
              <Input
                type="text"
                value={user.userAuth.fullname || "N/A"}
                isReadOnly
              />
              <InputRightAddon >
                <Tooltip label="Update your name" hasArrow placement="top">
                  <Link to={routes.dashboardSetting} >
                    <Button  >
                      <GrUpdate />
                    </Button>
                  </Link>
                </Tooltip>
              </InputRightAddon>
            </InputGroup>
            <InputGroup>
              <InputLeftAddon color={bgColor} bgColor={bgColor1}>Phone</InputLeftAddon>
              <Input
                type="number"
                value={user.userAuth.phonenumber}
                isReadOnly
              />
              <InputRightAddon>
                <Tooltip
                  label="Update your phone number"
                  hasArrow
                  placement="top"
                >
                  <Link to={routes.dashboardSetting}>
                    <Button>
                      <GrUpdate />
                    </Button>
                  </Link>
                </Tooltip>
              </InputRightAddon>
            </InputGroup>
            <InputGroup>
              <InputLeftAddon color={bgColor} bgColor={bgColor1}>Address</InputLeftAddon>
              <Input
                type="text"
                value={user.userAuth.address || "N/A"}
                isReadOnly
              />
              <InputRightAddon>
                <Tooltip
                  label="Update your address"
                  hasArrow
                  placement="top"
                >
                  <Link to={routes.dashboardSetting}>
                    <Button>
                      <GrUpdate />
                    </Button>
                  </Link>
                </Tooltip>
              </InputRightAddon>
            </InputGroup>
          </Flex>
          <Formik
            initialValues={{ description: "", hasCertificate: false }}
            onSubmit={async (values, { setSubmitting }) => {
              console.log(values);
              setSubmitting(true);
              try {
                if (!user.userAuth) {
                  toast({
                    title: "Please login first !",
                    status: "error",
                    duration: 3000,
                    position: "top-right",
                    isClosable: true,
                  });
                } else if (
                  isUsers &&
                  user.userAuth.authorities[0].authority !== "Customer"
                ) {
                  toast({
                    title: "Just customer can make a request !",
                    status: "warning",
                    duration: 3000,
                    position: "top-right",
                    isClosable: true,
                  });
                } else if (
                  isUsers &&
                  (!user.userAuth.fullname ||
                    !user.userAuth.email ||
                    !user.userAuth.phonenumber)
                ) {
                  toast({
                    title: "Please update your profile first !",
                    status: "warning",
                    duration: 3000,
                    position: "top-right",
                    isClosable: true,
                  });
                } else if (
                  values.hasCertificate === true &&
                  selectedImages.length === 0
                ) {
                  toast({
                    title: "Please upload your certificate images !",
                    status: "warning",
                    duration: 3000,
                    position: "top-right",
                    isClosable: true,
                  });
                } else {
                  await checkCustomerPendingRequest(
                    user.userAuth.id,
                    values.description,
                    values.hasCertificate
                  ).then(() => {
                    setSubmitting(false);
                  });
                }
              } catch (e) {
                console.log(e);
              }
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Flex direction={"column"} align={"center"} gap={10}>
                  <FormControl>
                    <Center>
                      <Textarea
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        h={"150px"}
                        w={"100%"}
                        placeholder="Please write your request description here..."
                      />
                    </Center>
                  </FormControl>
                  <FormControl>
                    <Center>
                      <FormLabel
                        display={"inline-block"}
                        cursor={"pointer"}
                        color={bgColor}
                        bgColor={bgColor1}
                        borderRadius={"20px"}
                        _hover={{ bgColor: "gray.300" }}
                        m={"10px"}
                        p={3}
                      >
                        <Flex direction={"row"} alignItems={"center"} gap={2}>
                          <LuUpload />
                          Upload diamond images
                        </Flex>
                      </FormLabel>
                    </Center>
                    <Input
                      type="file"
                      name="diamondImages"
                      borderRadius={"10px"}
                      overflow={"hidden"}
                      opacity={0}
                      position={"absolute"}
                      bgColor={"blue"}
                      width={"0.1px"}
                      height={"0.1px"}
                      onChange={(e) => {
                        for (const image of selectedImages) {
                          const check =
                            image.name === Array.from(e.target.files)[0].name;
                          if (check) {
                            toast({
                              title: "Image already uploaded",
                              description:
                                "This image has already been uploaded",
                              position: "top-right",
                              status: "warning",
                              duration: 3000,
                              isClosable: true,
                            });
                            return;
                          }
                        }
                        selectedImages.push(...Array.from(e.target.files));
                        setSelectedImages([...selectedImages]);
                      }}
                    />
                  </FormControl>
                  {selectedImages.length > 0 && (
                    <Flex direction={"row"} alignItems={"center"} gap={10}>
                      <SimpleGrid columns={3} spacing={10}>
                        {selectedImages.map((image, index) => (
                          <Flex direction={"column"} gap={2}>
                            <Image
                              src={URL.createObjectURL(image)}
                              alt="not found"
                              w={"200px"}
                              h={"200px"}
                            />
                            <Button
                              colorScheme="red"
                              onClick={() =>
                                setSelectedImages((prev) =>
                                  prev.filter(
                                    (img) => img !== selectedImages[index]
                                  )
                                )
                              }
                            >
                              Remove
                            </Button>
                          </Flex>
                        ))}
                      </SimpleGrid>
                    </Flex>
                  )}
                  <FormControl>
                    <Checkbox
                      name="hasCertificate"
                      value={values.hasCertificate}
                      onChange={handleChange}
                      onClick={() => {
                        console.log(values.hasCertificate);
                      }}
                    >
                      <Text color={"gray"}>
                        Click if you has a diamond certificate and upload your
                        certificate images (Ex: GIA certificate)
                      </Text>
                    </Checkbox>
                  </FormControl>
                  <Button
                    type="submit"
                    color={bgColor}
                        bgColor={bgColor1}
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </Flex>
      </Flex>
    </>
  );
}
