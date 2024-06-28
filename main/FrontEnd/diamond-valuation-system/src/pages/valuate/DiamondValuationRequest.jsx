import {
  Divider,
  Flex,
  FormControl,
  Center,
  Textarea,
  useColorModeValue,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import Title from "../../components/Title";
import { Form, Formik } from "formik";
import axios from "axios";
import routes from "../../config/Config";
import { UserContext } from "../../components/GlobalContext/AuthContext";
export default function DiamondValuationRequest() {
  const user = useContext(UserContext);
  const bgColor = useColorModeValue("white", "black");
  const toast = useToast();
  return (
    <>
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        paddingTop={"30px"}
        bg={bgColor}
      >
        <Title
          title={"Diamond Valuation Request"}
          description={
            "Please fill in the form below to request a diamond valuation."
          }
          width={"80vw"}
        />
        <Divider m={"20px 0 20px 0"} />
        <Center mt={5} mb={5}>
          <Formik
            initialValues={{ description: "" }}
            onSubmit={(values, { setSubmitting }) => {
              try {
                if (localStorage.getItem("user") === null) {
                  toast({
                    title: "Please login first !",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                  setSubmitting(false);
                } else if (user.userAuth.roleid !== 5) {
                  toast({
                    title: "Just customer can make a request !",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
                  setSubmitting(false);
                } else {
                  axios
                    .post(
                      `${
                        import.meta.env.VITE_REACT_APP_BASE_URL
                      }/api/pending-request/create`,
                      {
                        customerId: user.userAuth.id,
                        description: values.description,
                      }
                    )
                    .then(function (response) {
                      if (response.status === 200) {
                        setSubmitting(false);
                        toast({
                          title: response.data,
                          status: "success",
                          duration: 3000,
                          isClosable: true,
                        });
                      }
                    });
                }
              } catch (e) {
                console.log(e);
              }
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Flex direction={"column"} align={"center"} gap={10}>
                  <FormControl>
                    <Textarea
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      h={"200px"}
                      w={{ base: "70vw", md: "50vw", lg: "40vw" }}
                      placeholder="Please write your request description here..."
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting}
                    m={"0 0 100px 0"}
                  >
                    Submit
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </Center>
      </Flex>
    </>
  );
}
