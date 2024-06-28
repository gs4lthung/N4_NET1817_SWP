import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import UploadImage from "../../components/UploadImage";
import axios from "axios";
export default function ManagerValuatedDiamondPage() {
  const [valuatedDiamond, setValuatedDiamond] = useState([]);
  const [selectedValuatedDiamond, setSelectedValuatedDiamond] = useState({});
  const viewValuatedDiamondDetail = useDisclosure();
  const viewValuatedDiamond = () => {
    axios
      .get(`http://diamondval-latest.onrender.com

/api/valuated-diamond/get/all`)
      .then(function (response) {
        console.log(response.data);
        setValuatedDiamond(response.data.content);
      });
  };
  useEffect(() => {
    viewValuatedDiamond();
  }, []);
  return (
    <>
      <TableContainer>
        <Table size={"sm"} colorScheme="blue">
          <Thead bg={"blue.400"}>
            <Tr>
              <Th>No</Th>
              <Th>Id</Th>
              <Th>Valuated Date</Th>
              <Th>Price</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {valuatedDiamond.map((item, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{item?.id || "N/A"}</Td>
                <Td>{item?.createdDate?.slice(0, 10) || "N/A"}</Td>
                <Td>{item?.price || "N/A"} $</Td>
                <Td>
                  <IconButton
                    icon={<ViewIcon />}
                    bgColor={"transparent"}
                    onClick={() => {
                      setSelectedValuatedDiamond(item);
                      viewValuatedDiamondDetail.onOpen();
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal
        isOpen={viewValuatedDiamondDetail.isOpen}
        onClose={viewValuatedDiamondDetail.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Valuated Diamond</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={"column"} gap={5}>
              <Text>ID: {selectedValuatedDiamond?.id || "N/A"}</Text>
              <Text>
                Created date:{" "}
                {selectedValuatedDiamond?.createdDate?.slice(0, 10) || "N/A"}
              </Text>
              <Text>Price: {selectedValuatedDiamond?.price || "N/A"} $</Text>
              <Text>Origin: {selectedValuatedDiamond?.origin || "N/A"}</Text>
              <Text>Shape: {selectedValuatedDiamond?.shape || "N/A"}</Text>
              <Text>
                Carat Weight: {selectedValuatedDiamond?.carat_weight || "N/A"}{" "}
                carat
              </Text>
              <Text>Color: {selectedValuatedDiamond?.color || "N/A"}</Text>
              <Text>Cut: {selectedValuatedDiamond?.cut || "N/A"}</Text>
              <Text>Clarity: {selectedValuatedDiamond?.clarity || "N/A"}</Text>
              <Text>
                Measurements: {selectedValuatedDiamond?.measurements || "N/A"}
              </Text>
              <Text>Polish: {selectedValuatedDiamond?.polish || "N/A"}</Text>
              <Text>
                Symmetry: {selectedValuatedDiamond?.symmetry || "N/A"}
              </Text>
              <Text>
                Fluorescence: {selectedValuatedDiamond?.fluorescence || "N/A"}
              </Text>
              <Text>
                Proportions: {selectedValuatedDiamond?.proportions || "N/A"}
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent={"center"}>
            <Flex direction={"column"}>
              <UploadImage diamondId={selectedValuatedDiamond?.id} />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
