import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import PageIndicator from "../../../components/PageIndicator";
import {
  IconButton,
  Modal,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { UserContext } from "../../../components/GlobalContext/AuthContext";
import { ViewIcon } from "@chakra-ui/icons";

export default function CommitmentTable() {
  const user = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const viewCommitment = useDisclosure();
  const [commitment, setCommitment] = useState([]);
  const [selectedCommitment, setSelectedCommitment] = useState({});
  const fetchCommitment = async (page) => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/commitment/get/all?page=${page}`
      )
      .then(function (response) {
        console.log(response.data);
        setCommitment(response.data.content);
        setTotalPages(response.data.totalPages);
      });
  };
  useEffect(() => {
    fetchCommitment(currentPage);
  }, []);
  useEffect(() => {
    fetchCommitment(currentPage);
  }, [currentPage]);

  return (
    <>
      <TableContainer>
        <Table size={"sm"} colorScheme="blue">
          <Thead bg={"blue.400"}>
            <Tr>
              <Th>No</Th>
              <Th>Request ID</Th>
              {user.userAuth.roleid === 2 && <Th>Customer Name</Th>}
              <Th>Created Date</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {commitment.map((item, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{item?.valuationRequestId || "N/A"}</Td>
                {user.userAuth.roleid === 2 && (
                  <Td>{item?.customerName || "N/A"}</Td>
                )}
                <Td>{item?.createdDate?.slice(0, 10) || "N/A"}</Td>
                <Td>
                  <IconButton
                    icon={<ViewIcon />}
                    bg={"transparent"}
                    onClick={() => {}}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <PageIndicator totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </>
  );
}
