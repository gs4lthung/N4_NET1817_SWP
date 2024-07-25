import {
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Skeleton,
  Box,
  Text,
  Center,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { getCustomerTransaction } from "../../service/GetCustomerTransaction";
import { UserContext } from "./../../components/GlobalContext/AuthContext";
import { format } from "date-fns";
import PageIndicator from "./../../components/PageIndicator";
export default function DashBoardTransaction({ hidePagination }) {
  const [transaction, setTransaction] = useState([]);
  const auth = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const fetchApi = async (id, page) => {
    try {
      const result = await getCustomerTransaction(id, page);
      setTransaction(result.content);
      setTotalPage(result.totalPages);
      setLoading(false);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchApi(auth.userAuth.id, currentPage);
  }, [currentPage]);
  return (
    <>
      <Box m={10}>
        <Center mb={5}>
          <Text fontSize={"4xl"} fontWeight={"bold"}>
            Transactions
          </Text>
        </Center>
        {totalPage === 0 ? (
          <Center>No transaction to show</Center>
        ) : (
          <Skeleton isLoaded={transaction.length > 0} height={"200px"}>
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
                    <Th>Transaction No</Th>
                    <Th>Name</Th>
                    <Th>Bank</Th>
                    <Th>Amount</Th>
                    <Th>Date</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loading && (
                    <>
                      <Tr>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                      </Tr>
                    </>
                  )}
                  {transaction &&
                    transaction.map((transaction, index) => {
                      return (
                        <Tr key={index}>
                          <Td>{index + 1}</Td>
                          <Td>{transaction?.transaction}</Td>
                          <Td>{transaction?.customerName}</Td>
                          <Td>{transaction?.bank}</Td>
                          <Td>
                            {new Intl.NumberFormat("vi-VN").format(
                              transaction?.amount
                            )}{" "}
                            vnd
                          </Td>
                          <Td>
                            {format(
                              new Date(transaction?.date),
                              "dd/MM/yyyy - HH:mm:ss"
                            )}
                          </Td>
                          <Td>{transaction?.order_info}</Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </TableContainer>
            {!hidePagination && (
              <Center>
                <PageIndicator
                  totalPages={totalPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </Center>
            )}
          </Skeleton>
        )}
      </Box>
    </>
  );
}
