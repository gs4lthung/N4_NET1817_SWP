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
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import Title from "../../components/Title";
import { Form, Formik } from "formik";
import axios from "axios";
import { UserContext } from "../../components/GlobalContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import routes from "../../config/Config";
import { LuUpload } from "react-icons/lu";

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
  const createPendingRequest = async (customerId, description, token) => {
    await axios
      .post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/pending-request/create`,
        {
          customerId: customerId,
          description: description,
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
  const checkCustomerPendingRequest = async (customerId, description) => {
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
          createPendingRequest(customerId, description, user.userAuth.token);
        }
      });
  };
  const handleSubmitImages = async (pendingRequestId) => {
    try {
      setIsUpLoading(true);
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
      setIsUpLoading(false);
      toast({
        title: "Request submitted successfully",
        position: "top-right",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(routes.pendingRequest);
    } catch (error) {
      setIsUpLoading(false);
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
        pt={"100px"}
      >
        <Flex
          direction={"column"}
          align={"center"}
          p={8}
          border={"1px solid gray"}
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
          <Formik
            initialValues={{ description: "" }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSubmitting(true);
                if (localStorage.getItem("user") === null) {
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
                } else {
                  setSubmitting(true);
                  checkCustomerPendingRequest(
                    user.userAuth.id,
                    values.description
                  );
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
                    <Textarea
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      h={"150px"}
                      w={{ base: "70vw", md: "50vw", lg: "40vw" }}
                      placeholder="Please write your request description here..."
                    />
                  </FormControl>
                  <FormControl>
                    <Center>
                      <FormLabel
                        display={"inline-block"}
                        cursor={"pointer"}
                        bgColor={"gray.200"}
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
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting || isUploading}
                    isDisabled={isSubmitting || isUploading}
                    m={"0 0 100px 0"}
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
