import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  Skeleton,
  useToast,
  Tooltip,
  Box,
  TableCaption,
} from "@chakra-ui/react";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../components/GlobalContext/AuthContext";
import UploadImage from "../../../components/UploadImage";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage } from "@cloudinary/react";
import { lazyload, placeholder } from "@cloudinary/react";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { sha1 } from "js-sha1";
import PageIndicator from "../../../components/PageIndicator";
import { format } from "date-fns";
import { motion } from "framer-motion";
export default function ValuationStaffDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const viewValuationResult = useDisclosure();
  const [processResult, setProcessResult] = useState([]);
  const [selectedProcessResult, setSelectedProcessResult] = useState({});
  const [isGeneratePrice, setIsGeneratePrice] = useState(false);
  const fetchProcessResult = (page, valuationStaffId) => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/process-result/get/valuation-staff?page=${page}&valuationStaffId=${valuationStaffId}`
      )
      .then(function (response) {
        console.log(response.data);
        if (response.status === 200) {
          setProcessResult(response.data.content);
          setTotalPages(response.data.totalPages);
        }
      });
  };
  useEffect(() => {
    fetchProcessResult(currentPage, user.userAuth.id);
  }, [currentPage]);
  const valuateDiamond = (id, values) => {
    axios
      .put(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/valuation-result/valuate?id=${id}`,
        {
          origin: values?.origin,
          shape: values?.shape,
          carat: values?.carat,
          color: values?.color,
          cut: values?.cut,
          clarity: values?.clarity,
          measurements: values?.measurements,
          polish: values?.polish,
          symmetry: values?.symmetry,
          fluorescence: values?.fluorescence,
          diamondTable: values?.diamondTable,
          depth: values?.depth,
          lengthToWidthRatio: values?.lengthToWidthRatio,
          price: values?.price,
        },
        {
          headers: {
            Authorization: `Bearer ${user.userAuth.token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast({
            title: "Success",
            description: response.data,
            position: "top-right",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          fetchProcessResult(currentPage, user.userAuth.id);
          viewValuationResult.onClose();
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.response.data,
          position: "top-right",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(error.response.data);
      });
  };
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
  });
  const [diamondImages, setDiamondImages] = useState([]);
  const fetchValuatedDiamondImages = (valuationResultId) => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/valuation-result/image/get?id=${valuationResultId}`
      )
      .then(function (response) {
        console.log(response.data);
        setDiamondImages(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const [isDeleted, setIsDeleted] = useState(false);
  const deleteImages = async (imageId) => {
    setIsDeleted(true);
    // const timestamp = Date.now() / 1000;
    // const formData = new FormData();
    // formData.append("public_id", imageId);
    // formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
    // formData.append("timestamp", timestamp);
    // formData.append(
    //   "signature",
    //   sha1(
    //     `public_id=${imageId}&timestamp=${timestamp}${
    //       import.meta.env.VITE_CLOUDINARY_API_SECRET
    //     }`
    //   )
    // );
    // const res = await fetch(
    //   `https://api.cloudinary.com/v1_1/${
    //     import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    //   }/image/destroy`,
    //   {
    //     method: "POST",
    //     body: formData,
    //   }
    // );
    // if (res) {
    // const data = await res.json();
    // console.log(data);
    await axios
      .delete(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/valuation-result/image/delete?id=${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${user.userAuth.token}`,
          },
        }
      )
      .then(function (response) {
        setIsDeleted(false);
        toast({
          title: "Success",
          description: response.data,
          position: "top-right",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate(0);
        }, 1000);
        console.log(response.data);
      });
    // }
  };
  const generatePrice = async (values) => {
    setIsGeneratePrice(true);
    if (
      values.carat === 0 ||
      values.shape === "" ||
      values.color === "" ||
      values.cut === "" ||
      values.clarity === ""
    ) {
      setIsGeneratePrice(false);
      return;
    }
    await axios
      .post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/diamond/calculate`,
        {
          gradingLab: "",
          carat: values.carat,
          shape: values.shape,
          color: values.color,
          cut: values.cut,
          clarity: values.clarity,
        },
        {
          headers: {
            Authorization: `Bearer ${user.userAuth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.body);
        setIsGeneratePrice(false);
        const test = new DOMParser().parseFromString(
          response.data.body,
          "text/xml"
        );
        const jsonResult = {};
        for (const child of test.querySelector("pr").children) {
          jsonResult[child.tagName.toLowerCase()] = child.textContent;
        }
        if (jsonResult.price === "There is no available data for this query.") {
          toast({
            title: "Diamond Valuation",
            description: "There is no available data for this query.",
            position: "top-right",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          values.price = 0;
        } else {
          toast({
            title: "Diamond Valuation",
            description: "Diamond has been valuated successfully",
            position: "top-right",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          values.price = jsonResult.price;
        }
      })
      .catch((error) => {
        setIsGeneratePrice(false);
        toast({
          title: "Diamond Valuation",
          description: error.response.data,
          position: "top-right",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };
  return (
    <>
      <Flex direction="column" gap={10}>
        <Center>
          <Text fontSize="4xl" fontWeight="bold">
            Valuation Diamond
          </Text>
        </Center>
        <Skeleton isLoaded={processResult.length > 0} height={"200px"}>
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
                  <Th isNumeric>No</Th>
                  <Th isNumeric>ID</Th>
                  <Th>Created Date</Th>
                  <Th>Service</Th>
                  <Th>Status</Th>
                  <Th>View</Th>
                </Tr>
              </Thead>
              <Tbody>
                {processResult.map((item, index) => (
                  <Tr
                    key={index}
                    as={motion.tr}
                    whileHover={{ scale: 1.02 }}
                    transition="0.1s linear"
                    _hover={{ bg: "gray.100" }}
                  >
                    <Td isNumeric>{index + 1}</Td>
                    <Td isNumeric>{item?.valuationResultId}</Td>
                    <Td>
                      {item?.createdDate
                        ? format(item?.createdDate, "dd/MM/yyyy - HH:mm:ss")
                        : "N/A"}
                    </Td>
                    <Td>
                      <Box
                        bg={
                          (item?.serviceName === "Normal" && "blue.200") ||
                          (item?.serviceName === "Pro" && "red.200") ||
                          (item?.serviceName === "Premium" && "yellow.200")
                        }
                        p={3}
                        borderRadius={"20px"}
                      >
                        <Center>{item?.serviceName}</Center>
                      </Box>
                    </Td>
                    <Td>
                      <Box
                        bg={
                          (item?.status === "Valuated" && "#68D391") ||
                          (item?.status === "Not resolved yet" &&
                            "RGBA(0, 0, 0, 0.24)")
                        }
                        p={3}
                        borderRadius={"20px"}
                      >
                        <Center>{item?.status}</Center>
                      </Box>
                    </Td>
                    <Td>
                      <IconButton
                        icon={<ViewIcon />}
                        bgColor={"transparent"}
                        color="black"
                        onClick={() => {
                          setSelectedProcessResult(item);
                          fetchValuatedDiamondImages(item?.valuationResultId);
                          viewValuationResult.onOpen();
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
      </Flex>
      <Modal
        isOpen={viewValuationResult.isOpen}
        onClose={viewValuationResult.onClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Valuation Result</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                origin: selectedProcessResult?.origin,
                shape: selectedProcessResult?.shape,
                carat: selectedProcessResult?.carat,
                color: selectedProcessResult?.color,
                cut: selectedProcessResult?.cut,
                clarity: selectedProcessResult?.clarity,
                measurements: selectedProcessResult?.measurements,
                polish: selectedProcessResult?.polish,
                symmetry: selectedProcessResult?.symmetry,
                fluorescence: selectedProcessResult?.fluorescence,
                diamondTable: selectedProcessResult?.diamondTable,
                depth: selectedProcessResult?.depth,
                lengthToWidthRatio: selectedProcessResult?.lengthToWidthRatio,
                price: selectedProcessResult?.price,
              }}
              onSubmit={(values, { setSubmitting }) => {
                valuateDiamond(
                  selectedProcessResult?.valuationResultId,
                  values
                );
                setSubmitting(false);
              }}
            >
              {({ values, handleChange, handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <Flex direction={"column"} gap={5}>
                    <SimpleGrid columns={2} spacing={5}>
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "Origin"
                      ) && (
                        <FormControl>
                          <FormLabel>Origin</FormLabel>
                          <Select
                            name="origin"
                            placeholder="Select a origin"
                            value={values.origin}
                            onChange={handleChange}
                          >
                            <option value="Natural">Natural</option>
                            <option value="Lab Grown">Lab Grown</option>
                          </Select>
                        </FormControl>
                      )}
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "Shape"
                      ) && (
                        <FormControl>
                          <FormLabel>Shape</FormLabel>
                          <Select
                            name="shape"
                            placeholder="Select a shape"
                            value={values.shape}
                            onChange={handleChange}
                            onBlur={() => {
                              if (!isGeneratePrice) {
                                generatePrice(values);
                              }
                            }}
                          >
                            <option value="Round">Round</option>
                            <option value="Triangle">Triangle</option>
                            <option value="Oval">Oval</option>
                            <option value="Pear">Pear</option>
                            <option value="Marquise">Marquise</option>
                            <option value="Heart">Heart</option>
                            <option value="Emerald">Emerald</option>
                            <option value="Princess">Princess</option>
                            <option value="Asscher">Asscher</option>
                            <option value="Radiant">Radiant</option>
                            <option value="Cushion">Cushion</option>
                            <option value="Baguette">Baguette</option>
                          </Select>
                        </FormControl>
                      )}
                    </SimpleGrid>
                    {selectedProcessResult?.serviceStatistic?.includes(
                      "Carat"
                    ) && (
                      <Field name="carat">
                        {({ field, form }) => (
                          <FormControl>
                            <FormLabel>Carat</FormLabel>
                            <NumberInput
                              defaultValue={1}
                              min={0}
                              max={10}
                              step={0.1}
                              {...field}
                              onChange={(val) => {
                                form.setFieldValue(field.name, val);
                              }}
                              onBlur={() => {
                                if (!isGeneratePrice) {
                                  generatePrice(values);
                                }
                              }}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                        )}
                      </Field>
                    )}
                    <SimpleGrid columns={2} spacing={5}>
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "Color"
                      ) && (
                        <FormControl>
                          <FormLabel>Color</FormLabel>
                          <Select
                            name="color"
                            placeholder="Select a color"
                            value={values.color}
                            onChange={handleChange}
                            onBlur={() => {
                              if (!isGeneratePrice) {
                                generatePrice(values);
                              }
                            }}
                          >
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                            <option value="G">G</option>
                            <option value="H">H</option>
                            <option value="I">I</option>
                            <option value="J">J</option>
                            <option value="K">K</option>
                            <option value="L">L</option>
                            <option value="M">M</option>
                            <option value="N">N</option>
                          </Select>
                        </FormControl>
                      )}
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "Cut"
                      ) && (
                        <FormControl>
                          <FormLabel>Cut</FormLabel>
                          <Select
                            name="cut"
                            placeholder="Select a cut"
                            value={values.cut}
                            onChange={handleChange}
                            onBlur={() => {
                              if (!isGeneratePrice) {
                                generatePrice(values);
                              }
                            }}
                          >
                            <option value="Excellent">Excellent</option>
                            <option value="Very Good">Very Good</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                          </Select>
                        </FormControl>
                      )}
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "Clarity"
                      ) && (
                        <FormControl>
                          <FormLabel>Clarity</FormLabel>
                          <Select
                            name="clarity"
                            placeholder="Select a clarity"
                            value={values.clarity}
                            onChange={handleChange}
                            onBlur={() => {
                              if (!isGeneratePrice) {
                                generatePrice(values);
                              }
                            }}
                          >
                            <option value={"IF"}>IF</option>
                            <option value={"VVS1"}>VVS1</option>
                            <option value={"VVS2"}>VVS2</option>
                            <option value={"VS1"}>VS1</option>
                            <option value={"VS2"}>VS2</option>
                            <option value={"SI1"}>SI1</option>
                            <option value={"SI2"}>SI2</option>
                            <option value={"I1"}>I1</option>
                            <option value={"I2"}>I2</option>
                            <option value={"I3"}>I3</option>
                          </Select>
                        </FormControl>
                      )}
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "Symmetry"
                      ) && (
                        <FormControl>
                          <FormLabel>Symmetry</FormLabel>
                          <Select
                            name="symmetry"
                            placeholder="Select a symmetry"
                            value={values.symmetry}
                            onChange={handleChange}
                          >
                            <option value="Excellent">Excellent</option>
                            <option value="Very Good">Very Good</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                          </Select>
                        </FormControl>
                      )}{" "}
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "Polish"
                      ) && (
                        <FormControl>
                          <FormLabel>Polish</FormLabel>
                          <Select
                            name="polish"
                            placeholder="Select a polish"
                            value={values.polish}
                            onChange={handleChange}
                          >
                            <option value="Excellent">Excellent</option>
                            <option value="VeryGood">Very Good</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                          </Select>
                        </FormControl>
                      )}{" "}
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "Fluorescence"
                      ) && (
                        <FormControl>
                          <FormLabel>Fluorescence</FormLabel>
                          <Select
                            name="fluorescence"
                            placeholder="Select a fluorescence"
                            value={values.fluorescence}
                            onChange={handleChange}
                          >
                            <option value="None">None</option>
                            <option value="Faint">Faint</option>
                            <option value="Medium">Medium</option>
                            <option value="Strong">Strong</option>
                            <option value="very Strong">Very Strong</option>
                          </Select>
                        </FormControl>
                      )}
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "Measurements"
                      ) && (
                        <FormControl>
                          <FormLabel>Measurements</FormLabel>
                          <Input
                            name="measurements"
                            type="text"
                            onChange={handleChange}
                            value={values.measurements}
                          />
                        </FormControl>
                      )}
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "Table"
                      ) && (
                        <Field name="diamondTable">
                          {({ field, form }) => (
                            <FormControl>
                              <FormLabel>Table</FormLabel>
                              <NumberInput
                                defaultValue={1}
                                min={0}
                                max={10}
                                step={0.1}
                                {...field}
                                onChange={(val) => {
                                  form.setFieldValue(field.name, val);
                                }}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>
                          )}
                        </Field>
                      )}
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "Depth"
                      ) && (
                        <Field name="depth">
                          {({ field, form }) => (
                            <FormControl>
                              <FormLabel>Depth</FormLabel>
                              <NumberInput
                                defaultValue={1}
                                min={0}
                                max={10}
                                step={0.1}
                                {...field}
                                onChange={(val) => {
                                  form.setFieldValue(field.name, val);
                                }}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>
                          )}
                        </Field>
                      )}{" "}
                      {selectedProcessResult?.serviceStatistic?.includes(
                        "L/W Ratio"
                      ) && (
                        <Field name="lenghtToWidthRatio">
                          {({ field, form }) => (
                            <FormControl>
                              <FormLabel>L/W Ratio</FormLabel>
                              <NumberInput
                                defaultValue={1}
                                min={0}
                                max={10}
                                step={0.1}
                                {...field}
                                onChange={(val) => {
                                  form.setFieldValue(field.name, val);
                                }}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>
                          )}
                        </Field>
                      )}
                    </SimpleGrid>
                    <Tooltip
                      label="Generate price just by Shape & 4C attributes"
                      hasArrow
                    >
                      <Button
                        isLoading={isGeneratePrice}
                        isDisabled={isGeneratePrice}
                        onClick={() => {
                          if (
                            values.carat === 0 ||
                            values.shape === "" ||
                            values.color === "" ||
                            values.cut === "" ||
                            values.clarity === ""
                          ) {
                            toast({
                              title: "Diamond Valuation",
                              description:
                                "Please fill in all the Shape and 4C fields",
                              position: "top-right",
                              status: "warning",
                              duration: 3000,
                              isClosable: true,
                            });
                          }
                          generatePrice(values);
                        }}
                      >
                        Generate price
                      </Button>
                    </Tooltip>
                    <FormControl>
                      <Field name="price">
                        {({ field, form }) => (
                          <Tooltip
                            label="Price must be greater than 0 and less than 100000"
                            hasArrow
                          >
                            <FormControl>
                              <FormLabel>Price</FormLabel>
                              <NumberInput
                                min={1}
                                max={100000}
                                step={1}
                                {...field}
                                onChange={(val) => {
                                  form.setFieldValue(field.name, val);
                                }}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>
                          </Tooltip>
                        )}
                      </Field>
                    </FormControl>
                    <Center>
                      <Button
                        type="submit"
                        colorScheme="blue"
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting}
                      >
                        Submit
                      </Button>
                    </Center>
                  </Flex>
                </Form>
              )}
            </Formik>
            <Flex justify={"center"}>
              <SimpleGrid columns={4} spacing={10}>
                {diamondImages?.map((image, index) => {
                  return (
                    <>
                      <Flex direction={"column"} key={index}>
                        <AdvancedImage
                          key={index}
                          cldImg={cld
                            .image(image)
                            .resize(thumbnail().width(200).height(200))}
                          plugins={[
                            lazyload(),
                            placeholder({
                              mode: "blur",
                            }),
                          ]}
                        />
                        <Button
                          isDisabled={isDeleted}
                          isLoading={isDeleted}
                          colorScheme="red"
                          onClick={() => {
                            deleteImages(image);
                          }}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </>
                  );
                })}
              </SimpleGrid>
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent={"center"}>
            <Flex direction={"column"}>
              <UploadImage
                diamondId={selectedProcessResult?.valuationResultId}
                type={"valuation_result"}
              />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
