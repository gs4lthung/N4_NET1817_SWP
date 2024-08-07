import { ViewIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
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
  SimpleGrid,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Field, Form, Formik } from "formik";
import { GrUpdate } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { UserContext } from "../../../components/GlobalContext/AuthContext";
import { IoMdCreate } from "react-icons/io";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { motion } from "framer-motion";

export default function ServiceTable() {
  const user = useContext(UserContext);
  const toast = useToast();
  const viewService = useDisclosure();
  const confirmDeleteService = useDisclosure();
  const cancelRef = useRef();
  const [isDelete, setIsDelete] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [service, setService] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const fetchService = () => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/service/get/all`)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          setService(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const createService = (values) => {
    let statistic = "";
    if (values.origin) {
      statistic += "Origin, ";
    }
    if (values.carat) {
      statistic += "Carat, ";
    }
    if (values.color) {
      statistic += "Color, ";
    }
    if (values.cut) {
      statistic += "Cut, ";
    }
    if (values.clarity) {
      statistic += "Clarity, ";
    }
    if (values.shape) {
      statistic += "Shape, ";
    }
    if (values.symmetry) {
      statistic += "Symmetry, ";
    }
    if (values.polish) {
      statistic += "Polish, ";
    }
    if (values.fluorescence) {
      statistic += "Fluorescence, ";
    }
    statistic = statistic.slice(0, -2);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/service/create`,
        {
          name: values.name,
          price: values.price,
          time: values.time,
          statistic: statistic,
        },
        {
          headers: {
            Authorization: `Bearer ${user.userAuth.token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data.message.includes("successful")) {
            console.log(response.data.message);
            toast({
              title: "Success",
              description: response.data.message,
              position: "top-right",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            fetchService();
            viewService.onClose();
          }
        }
      });
  };
  const updateService = (values) => {
    let statistic = "";
    if (values.origin) {
      statistic += "Origin, ";
    }
    if (values.carat) {
      statistic += "Carat, ";
    }
    if (values.color) {
      statistic += "Color, ";
    }
    if (values.cut) {
      statistic += "Cut, ";
    }
    if (values.clarity) {
      statistic += "Clarity, ";
    }
    if (values.shape) {
      statistic += "Shape, ";
    }
    if (values.symmetry) {
      statistic += "Symmetry, ";
    }
    if (values.polish) {
      statistic += "Polish, ";
    }
    if (values.fluorescence) {
      statistic += "Fluorescence, ";
    }
    statistic = statistic.slice(0, -2);
    axios
      .put(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/service/update`,
        {
          id: values.id,
          name: values.name,
          price: values.price,
          time: values.time,
          statistic: statistic,
        },
        {
          headers: {
            Authorization: `Bearer ${user.userAuth.token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data.message.includes("successful")) {
            console.log(response.data.message);
            toast({
              title: "Success",
              description: response.data.message,
              position: "top-right",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            fetchService();
            viewService.onClose();
          }
        }
      });
  };
  const deleteService = (serviceId, statisticId) => {
    setIsDelete(true);
    axios
      .delete(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/service/delete?serviceId=${serviceId}&statisticId=${statisticId}`,
        {
          headers: {
            Authorization: `Bearer ${user.userAuth.token}`,
          },
        }
      )
      .then((res) => {
        setIsDelete(false);
        if (res.status === 200) {
          if (res.data.message.includes("successful")) {
            toast({
              title: "Success",
              description: res.data.message,
              position: "top-right",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            fetchService();
            confirmDeleteService.onClose();
          }
        }
      })
      .catch((err) => {
        setIsDelete(false);
        toast({
          title: "Error",
          description: "Error while deleting service",
          position: "top-right",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        fetchService();
        confirmDeleteService.onClose();
      });
  };

  useEffect(() => {
    fetchService();
  }, []);
  return (
    <>
      <Flex direction={"column"} gap={10}>
        <Text fontSize={"4xl"} fontWeight={"bold"} align={"center"}>
          Mangagement Service
        </Text>
        <Center>
          <Button
            colorScheme="teal"
            leftIcon={<IoMdCreate />}
            onClick={() => {
              setSelectedService(null);
              setIsCreate(true);
              viewService.onOpen();
            }}
          >
            Create new service
          </Button>
        </Center>
        <Skeleton isLoaded={service.length > 0} h={"300px"}>
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
                  <Th>ID</Th>
                  <Th>Name</Th>
                  <Th>Price</Th>
                  <Th>Time</Th>
                  <Th>Statistic</Th>
                  <Th>Update</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {service?.map((item, index) => (
                  <Tr
                    key={index}
                    as={motion.tr}
                    whileHover={{ scale: 1.02 }}
                    transition="0.1s linear"
                    _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                  >
                    <Td>{item?.id}</Td>
                    <Td>{item?.name}</Td>
                    <Td>
                      {new Intl.NumberFormat("vi-VN").format(item?.price)} vnd
                    </Td>
                    <Td>{item?.time} days</Td>
                    <Td>
                      <Tooltip label={item?.statistic} hasArrow>
                        <Input readOnly type="text" value={item?.statistic} />
                      </Tooltip>
                    </Td>
                    <Td>
                      <IconButton
                        icon={
                          <GrUpdate
                            color={useColorModeValue("gray.800", "white")}
                          />
                        }
                        bgColor={"transparent"}
                        onClick={() => {
                          setIsCreate(false);
                          setSelectedService(item);
                          viewService.onOpen();
                        }}
                      />
                    </Td>
                    <Td>
                      <IconButton
                        icon={<MdDeleteOutline size={25} color="red" />}
                        bgColor={"transparent"}
                        onClick={() => {
                          setSelectedService(item);
                          confirmDeleteService.onOpen();
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Skeleton>
        <ConfirmAlert
          isOpen={confirmDeleteService.isOpen}
          onClose={confirmDeleteService.onClose}
          cancelRef={cancelRef}
          header="Delete Service"
          body="Are you sure you want to delete this service?"
          action="Delete"
          colorScheme="red"
          isDelete={isDelete}
          onClickFunc={() => {
            deleteService(selectedService?.id, selectedService?.statisticId);
          }}
        />
        <Modal
          isOpen={viewService.isOpen}
          onClose={viewService.onClose}
          size={"2xl"}
        >
          <ModalOverlay />
          <Formik
            initialValues={{
              id: selectedService?.id,
              name: selectedService?.name,
              price: selectedService?.price,
              time: selectedService?.time,
              statistic: selectedService?.statistic,
              origin: selectedService?.statistic?.includes("Origin")
                ? true
                : false,
              carat: selectedService?.statistic?.includes("Carat")
                ? true
                : false,
              color: selectedService?.statistic?.includes("Color")
                ? true
                : false,
              cut: selectedService?.statistic?.includes("Cut") ? true : false,
              clarity: selectedService?.statistic?.includes("Clarity")
                ? true
                : false,
              shape: selectedService?.statistic?.includes("Shape")
                ? true
                : false,
              symmetry: selectedService?.statistic?.includes("Symmetry")
                ? true
                : false,
              polish: selectedService?.statistic?.includes("Polish")
                ? true
                : false,
              fluorescence: selectedService?.statistic?.includes("Fluorescence")
                ? true
                : false,
              measurements: selectedService?.statistic?.includes("Measurements")
                ? true
                : false,
              diamondTable: selectedService?.statistic?.includes(
                "Diamond Table"
              )
                ? true
                : false,
              depth: selectedService?.statistic?.includes("Depth")
                ? true
                : false,
              lwRatio: selectedService?.statistic?.includes("L/W Ratio")
                ? true
                : false,
            }}
            onSubmit={(values, { setSubmitting }) => {
              if (isCreate) {
                createService(values);
                setIsCreate(false);
              } else {
                updateService(values);
              }
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <ModalContent>
                  <ModalHeader>Service</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Flex direction={"column"} gap={5}>
                      <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input
                          name="name"
                          type="text"
                          onChange={handleChange}
                          value={values.name}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Price (vnd)</FormLabel>
                        <Tooltip label="Price must be vnd" hasArrow>
                          <Input
                            name="price"
                            type="number"
                            onChange={handleChange}
                            value={values.price}
                          />
                        </Tooltip>
                      </FormControl>
                      <Field name="time">
                        {({ field, form }) => (
                          <FormControl isRequired>
                            <FormLabel>Time (days)</FormLabel>
                            <NumberInput
                              min={10}
                              max={60}
                              step={1}
                              {...field}
                              onChange={(value) => {
                                form.setFieldValue(field.name, value);
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
                      <SimpleGrid columns={4} gap={5}>
                        <Field name="carat">
                          {({ field, form }) => (
                            <Checkbox
                              isChecked={values.carat}
                              onChange={(e) => {
                                form.setFieldValue(
                                  field.name,
                                  e.target.checked
                                );
                              }}
                            >
                              Carat
                            </Checkbox>
                          )}
                        </Field>
                        <Field name="color">
                          {({ field, form }) => (
                            <Checkbox
                              isChecked={values.color}
                              onChange={(e) => {
                                form.setFieldValue(
                                  field.name,
                                  e.target.checked
                                );
                              }}
                            >
                              Color
                            </Checkbox>
                          )}
                        </Field>
                        <Field name="cut">
                          {({ field, form }) => (
                            <Checkbox
                              isChecked={values.cut}
                              onChange={(e) => {
                                form.setFieldValue(
                                  field.name,
                                  e.target.checked
                                );
                              }}
                            >
                              Cut
                            </Checkbox>
                          )}
                        </Field>
                        <Field name="clarity">
                          {({ field, form }) => (
                            <Checkbox
                              isChecked={values.clarity}
                              onChange={(e) => {
                                form.setFieldValue(
                                  field.name,
                                  e.target.checked
                                );
                              }}
                            >
                              Clarity
                            </Checkbox>
                          )}
                        </Field>
                        <Field name="shape">
                          {({ field, form }) => (
                            <Checkbox
                              isChecked={values.shape}
                              onChange={(e) => {
                                form.setFieldValue(
                                  field.name,
                                  e.target.checked
                                );
                              }}
                            >
                              Shape
                            </Checkbox>
                          )}
                        </Field>
                        <Field name="symmetry">
                          {({ field, form }) => (
                            <Checkbox
                              isChecked={values.symmetry}
                              onChange={(e) => {
                                form.setFieldValue(
                                  field.name,
                                  e.target.checked
                                );
                              }}
                            >
                              Symmetry
                            </Checkbox>
                          )}
                        </Field>
                        <Field name="polish">
                          {({ field, form }) => (
                            <Checkbox
                              isChecked={values.polish}
                              onChange={(e) => {
                                form.setFieldValue(
                                  field.name,
                                  e.target.checked
                                );
                              }}
                            >
                              Polish
                            </Checkbox>
                          )}
                        </Field>
                        <Field name="fluorescence">
                          {({ field, form }) => (
                            <Checkbox
                              isChecked={values.fluorescence}
                              onChange={(e) => {
                                form.setFieldValue(
                                  field.name,
                                  e.target.checked
                                );
                              }}
                            >
                              Fluorescence
                            </Checkbox>
                          )}
                        </Field>
                        <Field name="measurements">
                          {({ field, form }) => (
                            <Checkbox
                              isChecked={values.measurements}
                              onChange={(e) => {
                                form.setFieldValue(
                                  field.name,
                                  e.target.checked
                                );
                              }}
                            >
                              Measurements
                            </Checkbox>
                          )}
                        </Field>
                        <Field name="origin">
                          {({ field, form }) => (
                            <Checkbox
                              isChecked={values.origin}
                              onChange={(e) => {
                                form.setFieldValue(
                                  field.name,
                                  e.target.checked
                                );
                              }}
                            >
                              Origin
                            </Checkbox>
                          )}
                        </Field>
                      </SimpleGrid>
                    </Flex>
                  </ModalBody>
                  <Center>
                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        type="submit"
                        isDisabled={isSubmitting}
                        isLoading={isSubmitting}
                      >
                        {isCreate ? "Create" : "Update"}
                      </Button>
                    </ModalFooter>
                  </Center>
                </ModalContent>
              </Form>
            )}
          </Formik>
        </Modal>
      </Flex>
    </>
  );
}
