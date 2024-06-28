import {
  Flex,
  Text,
  Button,
  UnorderedList,
  ListItem,
  Card,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Center,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./GlobalContext/AuthContext";
import { vnpayPayment } from "../service/Payment";
import axios from "axios";

export default function ServiceCard({
  serviceId,
  type,
  price,
  time,
  attributes,
  color,
}) {
  const auth = useContext(UserContext);
  const nav = useNavigate();
  const location = useLocation();
  const handleSubmit = async () => {
    try {
      localStorage.setItem("serviceId", serviceId);
      const response = await axios.get(
        "http://localhost:8081/api/vnpay/create",
        {
          params: {
            amount: `${price}000`,
            orderInfo: "Thanh toan don hang",
            orderType: "Other",
          },
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      const result = await response.data;
      window.location.href = result;
      console.log(result);
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };
  // Function to fetch the payment result
  const fetchPaymentResult = async (params) => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/vnpay/payment_return",
        {
          params: params,
        }
      );
      console.log(response.data); // Handle the JSON response
    } catch (error) {
      console.error("Error fetching payment result:", error);
    }
  };

  // Check if the URL contains VNPay return parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has("vnp_Amount")) {
      // Extract parameters and fetch the payment result
      const params = {};
      queryParams.forEach((value, key) => {
        params[key] = value;
      });
      fetchPaymentResult(params);
    }
  }, [location.search]);
  return (
    <Card border={"1px solid"} w={{ base: "70vw", md: "40vw", lg: "20vw" }}>
      <CardHeader align="center">
        <Heading size={"md"} color={`${color}.400`}>
          {type}
        </Heading>
      </CardHeader>
      <Flex direction={"column"} align={"center"}>
        <Text fontSize={"5xl"}>${price}</Text>
        <Text fontSize={"lg"}>
          Valuation time: <strong>{time} days</strong>
        </Text>
      </Flex>
      <CardBody align={"start"}>
        <Text fontSize={"lg"}>We will valuate:</Text>
        <UnorderedList fontSize={"sm"}>
          {attributes.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </UnorderedList>
      </CardBody>
      <Center>
        <CardFooter>
          {/* <Link to={handleSubmit} state={{ serviceId: serviceId }}> */}
          <Button onClick={handleSubmit} colorScheme={color} size={"lg"}>
            Choose
          </Button>
          {/* </Link> */}
        </CardFooter>
      </Center>
    </Card>
  );
}
