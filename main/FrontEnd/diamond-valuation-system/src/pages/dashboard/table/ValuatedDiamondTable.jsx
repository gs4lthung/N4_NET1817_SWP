import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../components/GlobalContext/AuthContext";
import axios from "axios";
import { set } from "date-fns";
import PageIndicator from "../../../components/PageIndicator";
import {
  Center,
  Flex,
  IconButton,
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
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import ValuationResultModal from "../modal/ValuationResultModal";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import routes from "../../../config/Config";
import { PiFileTextBold } from "react-icons/pi";
export default function ValuatedDiamondTable() {
  const user = useContext(UserContext);
  const isUsers =
    user.userAuth &&
    user.userAuth.authorities &&
    user.userAuth.authorities.length > 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const viewValuationResult = useDisclosure();
  const [valuationResults, setValuationResults] = useState([]);
  const [selectedValuationResult, setSelectedValuationResult] = useState(null);
  const fetchValuatedDiamond = (id, page) => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/valuation-result/customer/get?id=${id}&page=${page}`
      )
      .then((res) => {
        console.log(res.data);
        setValuationResults(res.data.content);
        setTotalPages(res.data.totalPages);
      });
  };
  useEffect(() => {
    fetchValuatedDiamond(user.userAuth.id, currentPage);
  }, [currentPage]);
  return (
    <>
      <Flex direction={"column"} gap={10} m={10}>
        <Center>
          <Text fontSize={"4xl"} fontWeight={"bold"}>
            Valuation Result
          </Text>
        </Center>
        {totalPages === 0 ? (
          <Center>No valuation result to show</Center>
        ) : (
          <Skeleton isLoaded={valuationResults.length > 0} height={"200px"}>
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
                    <Th>No</Th>
                    <Th>ID</Th>
                    <Th>Price</Th>
                    <Th>Origin</Th>
                    <Th>Shape</Th>
                    <Th>Carat</Th>
                    <Th>Color</Th>
                    <Th>Cut</Th>
                    <Th>Clarity</Th>
                    <Th>View</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {valuationResults.map((valuationResult, index) => (
                    <Tr
                      key={index}
                      _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                    >
                      <Td>{index + 1}</Td>
                      <Td>
                        <Link
                          to={`${routes.diamondCheck}/${valuationResult.id}`}
                        >
                          <Tooltip label="Click to view valuation result">
                            <Flex
                              p={2}
                              gap={2}
                              align={"center"}
                              justify={"space-between"}
                              borderRadius={"20px"}
                              _hover={{ bg: useColorModeValue("blue.100","blue.400") }}
                            >
                              {valuationResult.id || "N/A"}
                              <FaExternalLinkAlt />
                            </Flex>
                          </Tooltip>
                        </Link>
                      </Td>
                      <Td>{valuationResult.price} $</Td>
                      <Td>{valuationResult.origin || "N/A"}</Td>
                      <Td>{valuationResult.shape || "N/A"}</Td>
                      <Td>{valuationResult.carat || "N/A"}</Td>
                      <Td>{valuationResult.color || "N/A"}</Td>
                      <Td>{valuationResult.cut || "N/A"}</Td>
                      <Td>{valuationResult.clarity || "N/A"}</Td>
                      <Td>
                        <IconButton
                          icon={<PiFileTextBold />}
                          bg={"transparent"}
                          color={useColorModeValue("gray.800", "gray.200")}
                          onClick={() => {
                            setSelectedValuationResult(valuationResult);
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
        )}
      </Flex>
      <ValuationResultModal
        selectedValuationResult={selectedValuationResult}
        viewValuationResult={viewValuationResult}
      />
    </>
  );
}
