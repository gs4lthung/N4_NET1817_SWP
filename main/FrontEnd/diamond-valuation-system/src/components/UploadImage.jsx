import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "./GlobalContext/AuthContext";
import { LuUpload } from "react-icons/lu";

export default function UploadImage({ diamondId, type }) {
  const user = useContext(UserContext);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUpLoading] = useState(false);
  const toast = useToast();
  const handleSubmitImages = async () => {
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
          console.log(data.public_id);

          if (type === "valuation_result") {
            axios
              .post(
                `${
                  import.meta.env.VITE_REACT_APP_BASE_URL
                }/api/valuation-result/image/create`,
                {
                  id: data?.public_id,
                  valuationResultId: diamondId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${user.userAuth.token}`,
                  },
                }
              )
              .then(function (response) {
                console.log(response.data);
              })
              .catch((err) => {
                setIsUpLoading(false);
                toast({
                  title: "Sending successful!",
                  position: "top-right",
                  description:
                    "Your diamond image has been submitted successfully",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              });
          } else if (type === "pending_request") {
            axios
              .post(
                `${
                  import.meta.env.VITE_REACT_APP_BASE_URL
                }/api/pending-request/image/create`,
                {
                  id: data?.public_id,
                  pendingRequestId: diamondId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${user.userAuth.token}`,
                  },
                }
              )
              .then(function (response) {
                console.log(response.data);
              })
              .catch((err) => {
                console.log(err);
                return;
              });
          }
        }
      }
      setIsUpLoading(false);
      toast({
        title: "Sending successful!",
        position: "top-right",
        description: "Your diamond image has been submitted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
      <FormControl w={"auto"}>
        <FormLabel
          display={"inline-block"}
          cursor={"pointer"}
          bgColor={useColorModeValue("gray.200", "gray.800")}
          borderRadius={"10px"}
          _hover={{ bgColor: useColorModeValue("gray.300", "gray.900") }}
          m={"10px"}
          p={3}
        >
          <Flex direction={"row"} alignItems={"center"} gap={2}>
            <LuUpload />
            Upload diamond images
          </Flex>
        </FormLabel>
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
              const check = image.name === Array.from(e.target.files)[0].name;
              if (check) {
                toast({
                  title: "Image already uploaded",
                  description: "This image has already been uploaded",
                  position: "top-right",
                  status: "error",
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
        <Flex direction={"column"} alignItems={"center"} gap={2}>
          <Flex direction={"column"} gap={5}>
            {selectedImages.map((image, index) => (
              <Flex direction={"column"} gap={2} key={index}>
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
                      prev.filter((img) => img !== selectedImages[index])
                    )
                  }
                >
                  Remove
                </Button>
              </Flex>
            ))}
          </Flex>
          <Button
            colorScheme="green"
            onClick={handleSubmitImages}
            isLoading={isUploading}
          >
            Upload
          </Button>
        </Flex>
      )}
    </>
  );
}
