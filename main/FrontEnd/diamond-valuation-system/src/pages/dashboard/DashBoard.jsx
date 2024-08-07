import { IoIosCreate } from "react-icons/io";
import {
  Box,
  Button,
  StackDivider,
  Text,
  VStack,
  HStack,
  Image,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardHeader,
  Flex,
  CardBody,
  Center,
  Stack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { viewCustomerRequest } from "../../service/ViewRequest";
import { UserContext } from "../../components/GlobalContext/AuthContext";
import axios from "axios";
import { PiPiggyBankBold } from "react-icons/pi";
import { MdDone } from "react-icons/md";
import { IoDiamond } from "react-icons/io5";
import DashBoardTransaction from "./DashBoardTransaction";
import DashBoardAppoint from "./DashBoardAppoint";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import routes from "../../config/Config";
import ValuatedDiamondTable from "./table/ValuatedDiamondTable";
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export default function DashBoard() {
  const navigate=useNavigate();
  const user = useContext(UserContext);
  const isUsers =
    user.userAuth &&
    user.userAuth.authorities &&
    user.userAuth.authorities.length > 0;
  const [request, SetRequest] = useState([]);
  const [income, setIncome] = useState(null);
  const [valuatedDiamond, setValuatedDiamond] = useState(null);
  const [notDoneValuatedDiamond, setNotDoneValuatedDiamond] = useState(null);
  const fetchTotalIncome = async () => {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/payment/income`)
      .then((res) => {
        setIncome(res.data);
      });
  };
  const [incomeByMonth, setIncomeByMonth] = useState([
    { month: "January", income: 0 },
    { month: "February", income: 0 },
    { month: "March", income: 0 },
    { month: "April", income: 0 },
    { month: "May", income: 0 },
    { month: "June", income: 0 },
    { month: "July", income: 0 },
    { month: "August", income: 0 },
    { month: "September", income: 0 },
    { month: "October", income: 0 },
    { month: "November", income: 0 },
    { month: "December", income: 0 },
  ]);
  const fetchIncomeByMonth = async (month) => {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/payment/income/month?id=${month}`
      )
      .then((res) => {
        setIncomeByMonth((prev) => {
          prev[month - 1].income = res.data;
          return [...prev];
        });
      });
  };

  const [requestStatus, setRequestStatus] = useState([
    { status: "Not resolved yet", total: 0 },
    { status: "Canceled", total: 0 },
    { status: "Contacted", total: 0 },
    { status: "Paid", total: 0 },
    { status: "Diamond Received", total: 0 },
    { status: "Valuated", total: 0 },
    { status: "Finished", total: 0 },
    { status: "Done", total: 0 },
    { status: "Sealed", total: 0 },
    { status: "Lost Receipt", total: 0 },
  ]);
  const fetchStatusTotal = async (status) => {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/process-request/total?status=${status}`
      )
      .then((res) => {
        setRequestStatus((prev) => {
          const index = prev.findIndex((item) => item.status === status);
          prev[index].total = res.data;
          return [...prev];
        });
      });
  };
  const fetchTotalValuatedDiamond = async () => {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/valuation-result/total`
      )
      .then((res) => {
        setValuatedDiamond(res.data);
      });
  };
  const fetchTotalNotDoneValuatedDiamond = async () => {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/valuation-result/total/not-done`
      )
      .then((res) => {
        setNotDoneValuatedDiamond(res.data);
      });
  };
  useEffect(() => {
    if (isUsers && user.userAuth.authorities[0].authority === "Customer") {
      const fetchApi = async (id) => {
        try {
          const result = await viewCustomerRequest(1, id);
          SetRequest(result.content);
        } catch (error) {
          console.log(error);
        }
      };
      fetchApi(user.userAuth.id);
    } else {
      fetchTotalIncome();
      for (let i = 1; i <= 12; i++) {
        fetchIncomeByMonth(i);
      }

      for (let i = 0; i < requestStatus.length; i++) {
        fetchStatusTotal(requestStatus[i].status);
      }
      fetchTotalValuatedDiamond();
      fetchTotalNotDoneValuatedDiamond();
    }
  }, []);
  return (
    <>
      {isUsers && user.userAuth.authorities[0].authority === "Customer" ? (
        // <Flex direction={"column"} align={"center"} mt={10} gap={5}>
        //   <Link to={routes.pendingRequest}>
        //     <DashBoardAppoint hidePagination={true} />
        //   </Link>

        //   <Link to={routes.dashboardTransaction}>
        //     <DashBoardTransaction hidePagination={true} />
        //   </Link>
        //   <Link to={routes.valuatedDiamond}>
        //     <ValuatedDiamondTable hidePagination={true} />
        //   </Link>
        // </Flex>
        navigate(routes.pendingRequest)
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mx={14}>
            <Card border={"md"} shadow={"md"}>
              <CardHeader>
                <Flex align={"center"} gap={15}>
                  <PiPiggyBankBold size={30} />
                  <Text fontSize={"2xl"}>INCOME</Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <Center gap={2}>
                  <Text fontSize={"5xl"}>
                    {new Intl.NumberFormat("vi-VN").format(income)}
                  </Text>
                  vnd
                </Center>
              </CardBody>
            </Card>
            <Card border={"md"} shadow={"md"}>
              <CardHeader>
                <Flex align={"center"} gap={15}>
                  <MdDone size={30} style={{ background: "green", borderRadius:"8px" }} />
                  <Text fontSize={"2xl"}>DONE REQUEST</Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <Center gap={2}>
                  <Text fontSize={"5xl"}>{requestStatus[7].total}</Text>
                </Center>
              </CardBody>
            </Card>
            <Card border={"md"} shadow={"md"}>
              <CardHeader>
                <Flex align={"center"} gap={15}>
                  <IoDiamond size={30} />
                  <Text fontSize={"2xl"}>VALUATED DIAMOND</Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <Center gap={2}>
                  <Text fontSize={"5xl"}>{valuatedDiamond}</Text>
                </Center>
              </CardBody>
            </Card>
          </SimpleGrid>
          <Flex
            direction={"column"}
            justify={"center"}
            align={"center"}
            mt={10}
            w={"80vw"}
          >
            <Box w={"1000px"}>
              <Line
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    " November",
                    "December",
                  ],
                  datasets: [
                    {
                      data: [
                        incomeByMonth[0].income,
                        incomeByMonth[1].income,
                        incomeByMonth[2].income,
                        incomeByMonth[3].income,
                        incomeByMonth[4].income,
                        incomeByMonth[5].income,
                        incomeByMonth[6].income,
                        incomeByMonth[7].income,
                        incomeByMonth[8].income,
                        incomeByMonth[9].income,
                        incomeByMonth[10].income,
                        incomeByMonth[11].income,
                      ],
                      label: "Income in 2024 (vnd)",
                      borderColor: "#3e95cd",
                      fill: false,
                    },
                  ],
                }}
                options={{
                  title: {
                    display: true,
                    text: "Income in 2024 (vnd)",
                  },
                  legend: {
                    display: true,
                    position: "bottom",
                  },
                  indexAxis: "x",
                  scales: {
                    x: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
            <Flex mt={"100px"} gap={20}>
              <Flex w={"500px"} direction={"column"} align={"center"} gap={2}>
                <Pie
                  data={{
                    labels: requestStatus.map((item) => item.status),
                    datasets: [
                      {
                        label: "Num of request",
                        data: requestStatus.map((item) => item.total),
                        backgroundColor: [
                          "RGBA(0, 0, 0, 0.24)",
                          "#F56565",
                          "rgb(54, 162, 235)",
                          "#B794F4",
                          "#F687B3",
                          "#F6AD55",
                          "rgb(255, 205, 86)",
                          "#68D391",
                          "#2D3748",
                          "#718096",
                        ],
                        hoverOffset: 4,
                      },
                    ],
                  }}
                />
                <Text fontFamily={"monospace"} fontSize={"lg"}>
                  Request Status
                </Text>
              </Flex>
              <Flex w={"500px"} direction={"column"} align={"center"} gap={2}>
                <Pie
                  data={{
                    labels: ["Done", "Not Done"],
                    datasets: [
                      {
                        label: "Num of request",
                        data: [valuatedDiamond, notDoneValuatedDiamond],
                        backgroundColor: ["#68D391", "RGBA(0, 0, 0, 0.24)"],
                        hoverOffset: 4,
                      },
                    ],
                  }}
                />
                <Text fontFamily={"monospace"} fontSize={"lg"}>
                  Valuated Diamond
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
}
