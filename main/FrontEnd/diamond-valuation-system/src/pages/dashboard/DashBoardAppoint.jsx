import { IoIosCreate } from "react-icons/io";
import {
  Box,
  Button,
  StackDivider,
  Text,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Skeleton,
  Center,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { viewCustomerRequest } from "../../service/ViewRequest";
import { UserContext } from "../../components/GlobalContext/AuthContext";
import { NotificationContext  } from "../../components/GlobalContext/NotificationContext";
export default function DashBoardAppoint() {
  const user = useContext(UserContext);
  const { incrementNotifications } = useContext(NotificationContext);
  const [request, SetRequest] = useState([]);
  useEffect(() => {
    const fetchApi = async (id) => {
      try {
        const result = await viewCustomerRequest(1, id);
        SetRequest(result.content);
        incrementNotifications();
      } catch (error) {
        console.log(error);
      }
    };
    fetchApi(user.userAuth.id);
  }, []);
  return (
    <Box m={10}  >
      <Center mb={5}>
      <Text fontSize={"4xl"} fontWeight={"bold"}>
            Appointments
          </Text>
      </Center>
      
      {request?.length === 0 ? (
        <Box variant="simple" display="flex" justifyContent="center"  color="black" m={5}>
          No appointment to show
        </Box>
      ) : (
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
          <Table variant="unstyled">
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>Customer</Th>
                <Th>Date</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Description</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {request.map((req, i) => {
                return (
                  <Tr key={i} _hover={{bg:"gray.100"}}>
                    <Td>{i + 1}</Td>
                    <Td>{req.customerName}</Td>
                    <Td>{req.createdDate?.slice(0, 10)}</Td>
                    <Td>{req.customerEmail}</Td>
                    <Td>{req.customerPhone}</Td>
                    <Td>{req.description}</Td>
                    <Td>Contacting...</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
