import { CheckIcon, CloseIcon, ViewIcon } from "@chakra-ui/icons";
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
  Checkbox,
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
import { format, set } from "date-fns";
import { motion } from "framer-motion";
import PopoverInfo from "../../../components/PopoverInfo";
export default function ValuationStaffDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const viewValuationResult = useDisclosure();
  const [processResult, setProcessResult] = useState([]);
  const [selectedProcessResult, setSelectedProcessResult] = useState({});
  const [isGenerateBenchMarkPrice, setIsGenerateBenchMarkPrice] =
    useState(false);
  const [isGeneratePrice, setIsGeneratePrice] = useState(false);
  const [isGenerateCutGrade, setIsGenerateCutGrade] = useState(false);
  const [isGenerateClarity, setIsGenerateClarity] = useState(false);
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
          polish: values?.polish,
          symmetry: values?.symmetry,
          fluorescence: values?.fluorescence,
          length: values?.length,
          width: values?.width,
          depth: values?.depth,
          depthPct: values?.depthPct,
          tablePct: values?.tablePct,
          pavPct: values?.pavPct,
          pavAngle: values?.pavAngle,
          crownPct: values?.crownPct,
          crownAngle: values?.crownAngle,
          lowerHalfPct: values?.lowerHalfPct,
          starPct: values?.starPct,
          girdlePct: values?.girdlePct,
          culet: values?.culet,
          isLaserDrillHole: values.isLaserDrillHole,
          isFeather: values.isFeather,
          isCrystal: values.isCrystal,
          isChip: values.isChip,
          isNeedle: values.isNeedle,
          isCavity: values.isCavity,
          isPinpoint: values.isPinpoint,
          isBruise: values.isBruise,
          isCloud: values.isCloud,
          isEtchChannel: values.isEtchChannel,
          isTwinningWisp: values.isTwinningWisp,
          isIndentedNatural: values.isIndentedNatural,
          isKnot: values.isKnot,
          isNatural: values.isNatural,
          price: values.price,
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
  const generateBenchMarkPrice = async (values) => {
    setIsGenerateBenchMarkPrice(true);
    if (
      values.carat === 0 ||
      values.shape === "" ||
      values.color === "" ||
      values.cut === "" ||
      values.clarity === ""
    ) {
      setIsGenerateBenchMarkPrice(false);
      toast({
        title: "Diamond Valuation",
        description: "Please fill all the fields",
        position: "top-right",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
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
        setIsGenerateBenchMarkPrice(false);
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
        setIsGenerateBenchMarkPrice(false);
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
  const generatePrice = async (id, values) => {
    setIsGeneratePrice(true);
    if (
      values.origin === "" ||
      values.carat === 0 ||
      values.shape === "" ||
      values.color === "" ||
      values.cut === "" ||
      values.clarity === "" ||
      values.symmetry === "" ||
      values.polish === "" ||
      values.fluorescence === ""
    ) {
      setIsGeneratePrice(false);
      toast({
        title: "Diamond Valuation",
        description: "Please fill all the fields",
        position: "top-right",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    await axios
      .put(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/valuation-result/valuate/price?id=${id}`,
        {
          origin: values.origin,
          carat: values.carat,
          shape: values.shape,
          color: values.color,
          cut: values.cut,
          clarity: values.clarity,
          polish: values.polish,
          symmetry: values.symmetry,
          fluorescence: values.fluorescence,
        },
        {
          headers: {
            Authorization: `Bearer ${user.userAuth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setIsGeneratePrice(false);

        toast({
          title: "Diamond Valuation",
          description: "Diamond has been valuated successfully",
          position: "top-right",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        values.price = parseInt(response.data);
      })
      .catch((error) => {
        setIsGeneratePrice(false);
        toast({
          title: "Diamond Valuation",
          description: error.response,
          position: "top-right",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };
  const generateCutGrade = async (valuationResultId, values) => {
    setIsGenerateCutGrade(true);
    if (
      values.tablePct === 0 ||
      values.depthPct === 0 ||
      values.pavPct === 0 ||
      values.pavAngle === 0 ||
      values.crownPct === 0 ||
      values.crownAngle === 0 ||
      values.lowerHalfPct === 0 ||
      values.starPct === 0 ||
      values.girdlePct === 0 ||
      values.culet === ""
    ) {
      setIsGenerateCutGrade(false);
      toast({
        title: "Diamond Valuation",
        description: "Please fill all the fields",
        position: "top-right",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    await axios
      .put(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/valuation-result/valuate/cut?id=${valuationResultId}`,
        {
          tablePct: values.tablePct,
          depthPct: values.depthPct,
          pavPct: values.pavPct,
          pavAngle: values.pavAngle,
          crownPct: values.crownPct,
          crownAngle: values.crownAngle,
          lowerHalfPct: values.lowerHalfPct,
          starPct: values.starPct,
          girdlePct: values.girdlePct,
          culet: values.culet,
        },
        {
          headers: {
            Authorization: `Bearer ${user.userAuth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        values.cut = response.data;
        values.symmetry = response.data;
        values.polish = response.data;
        toast({
          title: "Diamond Valuation",
          description: "Cut grade has been generated successfully",
          position: "top-right",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsGenerateCutGrade(false);
      })
      .catch((error) => {
        setIsGenerateCutGrade(false);
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
  const generateClarityGrade = async (valuationResultId, values) => {
    setIsGenerateClarity(true);
    await axios
      .put(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/valuation-result/valuate/clarity?id=${valuationResultId}`,
        {
          isLaserDrillHole: values.isLaserDrillHole,
          isFeather: values.isFeather,
          isCrystal: values.isCrystal,
          isChip: values.isChip,
          isNeedle: values.isNeedle,
          isCavity: values.isCavity,
          isPinpoint: values.isPinpoint,
          isBruise: values.isBruise,
          isCloud: values.isCloud,
          isEtchChannel: values.isEtchChannel,
          isTwinningWisp: values.isTwinningWisp,
          isIndentedNatural: values.isIndentedNatural,
          isKnot: values.isKnot,
          isNatural: values.isNatural,
        },
        {
          headers: {
            Authorization: `Bearer ${user.userAuth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        values.clarity = response.data;
        toast({
          title: "Diamond Valuation",
          description: "Clarity grade has been generated successfully",
          position: "top-right",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsGenerateClarity(false);
      })
      .catch((error) => {
        setIsGenerateClarity(false);
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
                  <Th w={"150px"}>Created Date</Th>
                  <Th w={"150px"}>Update Date</Th>
                  <Th textAlign={"center"}>Service</Th>
                  <Th textAlign={"center"}>Status</Th>
                  <Th textAlign={"center"}>Certificate</Th>
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
                      {item?.updateDate
                        ? format(item?.updateDate, "dd/MM/yyyy - HH:mm:ss")
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
                    <Td textAlign={"center"}>
                      {item?.hasCertificate ? (
                        <CheckIcon color={"green"} />
                      ) : (
                        <CloseIcon color={"red"} />
                      )}
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
        size={"full"}
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
                polish: selectedProcessResult?.polish,
                symmetry: selectedProcessResult?.symmetry,
                fluorescence: selectedProcessResult?.fluorescence,
                length: selectedProcessResult?.length,
                width: selectedProcessResult?.width,
                depth: selectedProcessResult?.depth,
                depthPct: selectedProcessResult?.depthPct,
                tablePct: selectedProcessResult?.tablePct,
                pavPct: selectedProcessResult?.pavPct,
                pavAngle: selectedProcessResult?.pavAngle,
                crownPct: selectedProcessResult?.crownPct,
                crownAngle: selectedProcessResult?.crownAngle,
                lowerHalfPct: selectedProcessResult?.lowerHalfPct,
                starPct: selectedProcessResult?.starPct,
                girdlePct: selectedProcessResult?.girdlePct,
                culet: selectedProcessResult?.culet,
                isLaserDrillHole: selectedProcessResult?.laserDrillHole,
                isFeather: selectedProcessResult?.feather,
                isCrystal: selectedProcessResult?.crystal,
                isChip: selectedProcessResult?.chip,
                isNeedle: selectedProcessResult?.needle,
                isCavity: selectedProcessResult?.cavity,
                isPinpoint: selectedProcessResult?.pinpoint,
                isBruise: selectedProcessResult?.bruise,
                isCloud: selectedProcessResult?.cloud,
                isEtchChannel: selectedProcessResult?.etchChannel,
                isTwinningWisp: selectedProcessResult?.twinningWisp,
                isIndentedNatural: selectedProcessResult?.indentedNatural,
                isKnot: selectedProcessResult?.knot,
                isNatural: selectedProcessResult?.natural,
                benchMarkPrice: 0,
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
                      <FormControl>
                        <FormLabel>Shape</FormLabel>
                        <Select
                          name="shape"
                          placeholder="Select a shape"
                          value={values.shape}
                          onChange={handleChange}
                        >
                          <option value="Round">Round</option>
                          <option value="Oval">Oval</option>
                          <option value="Pear">Pear</option>
                          <option value="Marquise">Marquise</option>
                          <option value="Heart">Heart</option>
                          <option value="Emerald">Emerald</option>
                          <option value="Princess">Princess</option>
                          <option value="Asscher">Asscher</option>
                          <option value="Radiant">Radiant</option>
                          <option value="Cushion">Cushion</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                    <Field name="carat">
                      {({ field, form }) => (
                        <FormControl>
                          <FormLabel>Carat</FormLabel>
                          <NumberInput
                            defaultValue={1}
                            min={0}
                            max={4}
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
                    <Flex
                      direction={"column"}
                      gap={5}
                      p={8}
                      border={"1px solid gray"}
                      borderRadius={"24px"}
                    >
                      <FormControl>
                        <FormLabel>Cut</FormLabel>
                        <Select
                          name="cut"
                          placeholder="Select a cut"
                          value={values.cut}
                          onChange={handleChange}
                        >
                          <option value="Excellent">Excellent</option>
                          <option value="Very Good">Very Good</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                        </Select>
                      </FormControl>
                      <SimpleGrid columns={2} spacing={5}>
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
                        <FormControl>
                          <FormLabel>Polish</FormLabel>
                          <Select
                            name="polish"
                            placeholder="Select a polish"
                            value={values.polish}
                            onChange={handleChange}
                          >
                            <option value="Excellent">Excellent</option>
                            <option value="Very Good">Very Good</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>
                      <SimpleGrid columns={3} spacing={5}>
                        <Field name="length">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Length (mm)"
                                content=""
                                body="Length of diamond in mm"
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={50}
                                step={0.01}
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
                        <Field name="width">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Width (mm)"
                                content=""
                                body="Width of diamond in mm"
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={50}
                                step={0.01}
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
                        <Field name="depth">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Depth (mm)"
                                content=""
                                body="Depth of diamond in mm"
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={50}
                                step={0.01}
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
                      </SimpleGrid>
                      <SimpleGrid
                        columns={{ base: 3, md: 4, lg: 5 }}
                        spacing={5}
                      >
                        <Field name="depthPct">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Depth Percentage (%)"
                                content=""
                                body="Depth percentage is how tall the diamond is compared to its width. A good depth percentagemakes the diamond look bigger and enhances its sparkle. An ideal depth percentage is between 58% and 62%."
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={90}
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
                          )}
                        </Field>
                        <Field name="tablePct">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Table Percentage (%)"
                                content=""
                                body={
                                  "TabIe percentage is the size of the diamond's flat top part compared to its width. A well-proportioned table helps the diamond catch light and sparkle. An ideal table percentage is between 54% and 58%."
                                }
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={90}
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
                          )}
                        </Field>
                        <Field name="girdlePct">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Girdle Percentage (%)"
                                content=""
                                body={
                                  "The •girdle• is like the diamond's belt that separates the crown from the pavilion. When provided in percentage format it is calculated by dividing the girdle thickness in milimeters the diamond's diameter. But simply, ifs best if it's not 100 big or 100 small, around 2.5-5.5%"
                                }
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={90}
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
                          )}
                        </Field>
                        <Field name="starPct">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Star Percentage (%)"
                                content=""
                                body={
                                  "Star length is expressed as a percentage 0f the total width of the diamond from one edge 0f the girdle t0 the opposite edge through the center. The star facets play an important role in the dispersion 0f light and the overall brilliance of the diamond. A typical range for star length might be between 45% and 55%, but the optimal length can depend on other proportions and characteristics of the diamond."
                                }
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={90}
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
                          )}
                        </Field>
                        <Field name="lowerHalfPct">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Lower Half Percentage (%)"
                                content=""
                                body={
                                  "The lower half length is expressed as a percentage of the total depth of the diamond. GIA measures the length 0f the lower half facets from the girdle t0 their junction with the pavilion main facets. The lower half length can impact the appearance of the diamonds fire and scintillation. An ideal lower half length is between 75% and 85%."
                                }
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={90}
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
                          )}
                        </Field>
                        <Field name="crownPct">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Crown Percentage (%)"
                                content=""
                                body={
                                  "Crown height is how tall the top part of the diamond is, above the girdle. A nicely balanced crown height helps the diamond shine brighter and look more beautiful. An ideal crown height is between 14% and 16%."
                                }
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={90}
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
                          )}
                        </Field>
                        <Field name="crownAngle">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Crown Angle (degree °)"
                                content=""
                                body={
                                  "Crown angle is the angle between the top flat part and the sides of the diamond. A nice angle helps the diamond shine bright. An ideal crown angle is between 32° and 35°."
                                }
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={100}
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
                          )}
                        </Field>
                        <Field name="pavPct">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Pavilion Percentage (%)"
                                content=""
                                body={
                                  "PaviIion depth is how deep the bottom part of the diamond is, below the girdle. A goodd pavilion depth helps the diamond capture and reflect light for a brilliant appearance. An ideal pavilion depth is between 41% and 48%."
                                }
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={100}
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
                          )}
                        </Field>
                        <Field name="pavAngle">
                          {({ field, form }) => (
                            <FormControl>
                              <PopoverInfo
                                header="Pavilion Angle (degree °)"
                                content=""
                                body={
                                  "PaviIion depth is how deep the bottom part of the diamond is, below the girdle. A good pavilion depth helps the diamond capture and reflect light for a brilliant appearance. An ideal pavilion angle is between 40° and 43°"
                                }
                                align={"start"}
                              />
                              <NumberInput
                                defaultValue={0}
                                min={0}
                                max={100}
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
                          )}
                        </Field>
                        <FormControl>
                          <PopoverInfo
                            header="Culet"
                            content=""
                            body={
                              "The culet of a diamond refers to the tiny point at the bottom of the stone. Ideally, a diamond's culet is either very small or graded as 'none' or pointed,' meaning its not noticeable and doesnt impact the passage of light through the diamond, allowing for maximum brilliance and sparkle."
                            }
                            align={"start"}
                          />
                          <Select
                            name="culet"
                            placeholder="Select a culet size"
                            value={values.culet}
                            onChange={handleChange}
                          >
                            <option value="None">None</option>
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>
                      {selectedProcessResult?.hasCertificate ? (
                        <></>
                      ) : (
                        <Tooltip
                          label="Cut Grade, Symmetry & Polish are generated base on Depth, Table, Girdle, Star, Lower Half, Crown, Pavilion & Culet of a diamond"
                          hasArrow
                        >
                          <Button
                            isDisabled={isGenerateCutGrade}
                            isLoading={isGenerateCutGrade}
                            onClick={() => {
                              generateCutGrade(
                                selectedProcessResult?.valuationResultId,
                                values
                              );
                            }}
                          >
                            Generate Cut Grade, Symmetry & Polish
                          </Button>
                        </Tooltip>
                      )}
                    </Flex>
                    <Flex
                      direction={"column"}
                      gap={5}
                      p={8}
                      border={"1px solid gray"}
                      borderRadius={"24px"}
                    >
                      <FormControl>
                        <FormLabel>Clarity</FormLabel>
                        <Select
                          name="clarity"
                          placeholder="Select a clarity"
                          value={values.clarity}
                          onChange={handleChange}
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
                      <SimpleGrid columns={7} spacing={5}>
                        <Field name="isLaserDrillHole">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isLaserDrillHole}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Laser Dril Hole
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isFeather">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isFeather}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Feather
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isCrystal">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isCrystal}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Crystal
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isChip">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isChip}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Chip
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isNeedle">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isNeedle}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Needle
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isCavity">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isCavity}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Cavity
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isPinpoint">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isPinpoint}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Pinpoint
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isBruise">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isBruise}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Bruise
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isCloud">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isCloud}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Cloud
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isEtchChannel">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isEtchChannel}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Etch Channel
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isTwinningWisp">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isTwinningWisp}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Twinning Wisp
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isIndentedNatural">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isIndentedNatural}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Idented Natural
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isKnot">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isKnot}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Knot
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isNatural">
                          {({ field, form }) => (
                            <FormControl>
                              <Checkbox
                                isChecked={values.isNatural}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.checked
                                  );
                                }}
                              >
                                Natural
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                      </SimpleGrid>
                      {selectedProcessResult?.hasCertificate ? (
                        <></>
                      ) : (
                        <Button
                          isDisabled={isGenerateClarity}
                          isLoading={isGenerateClarity}
                          onClick={() => {
                            generateClarityGrade(
                              selectedProcessResult?.valuationResultId,
                              values
                            );
                          }}
                        >
                          Generate Clarity Grade
                        </Button>
                      )}
                    </Flex>
                    <SimpleGrid columns={2} spacing={5}>
                      <FormControl>
                        <FormLabel>Color</FormLabel>
                        <Select
                          name="color"
                          placeholder="Select a color"
                          value={values.color}
                          onChange={handleChange}
                        >
                          <option value="D">D</option>
                          <option value="E">E</option>
                          <option value="F">F</option>
                          <option value="G">G</option>
                          <option value="H">H</option>
                          <option value="I">I</option>
                          <option value="J">J</option>
                          <option value="K">K</option>
                        </Select>
                      </FormControl>
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
                          <option value="Very Strong">Very Strong</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                    <SimpleGrid columns={2} spacing={5}>
                      <Tooltip
                        label="Generate price just by Shape & 4C attributes"
                        hasArrow
                      >
                        <Button
                          isLoading={isGenerateBenchMarkPrice}
                          isDisabled={isGenerateBenchMarkPrice}
                          onClick={() => {
                            generateBenchMarkPrice(values);
                          }}
                        >
                          Generate Benchmark Price
                        </Button>
                      </Tooltip>
                      <Tooltip
                        label="Generate benchmark price just by Shape & 4C attributes"
                        hasArrow
                      >
                        <Button
                          isLoading={isGeneratePrice}
                          isDisabled={isGeneratePrice}
                          onClick={() => {
                            generatePrice(
                              selectedProcessResult?.valuationResultId,
                              values
                            );
                          }}
                        >
                          Generate Price
                        </Button>
                      </Tooltip>
                    </SimpleGrid>
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
                        <Tooltip label="Click to view image" placement="top">
                          <Box
                            transition={"transform 0.2s"}
                            _hover={{
                              transform: "scale(1.5)",
                              boxShadow: "0 0 2px 1px rgba(0, 140, 186, 0.5)",
                            }}
                            onClick={() => {
                              window.open(cld.image(image).toURL(), "_blank");
                            }}
                          >
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
                          </Box>
                        </Tooltip>
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
