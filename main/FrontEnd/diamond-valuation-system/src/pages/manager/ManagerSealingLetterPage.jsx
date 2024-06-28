import React, { useEffect, useState,useRef } from "react";
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
  Button,
  Text,
  Flex,
  Icon,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { GiDiamondTrophy } from "react-icons/gi";
import { useReactToPrint } from "react-to-print";

import axios from "axios";
export default function ManagerSealingLetterPage() {
  const viewSealingLetterDetail = useDisclosure();
  const viewSealingLetterPrint = useDisclosure();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [sealingLetter, setSealingLetter] = useState([]);
  const [selectedSealingLetter, setSelectedSealingLetter] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);
  const viewSealingLetter = () => {
    axios
      .get(`http://diamondval-latest.onrender.com

/api/process-sealing/get/all?page=1`)
      .then(function (response) {
        console.log(response.data);
        setSealingLetter(response.data.content);
      });
  };
  const handleAcceptSealing = (id, type) => {
    axios
      .get(
        `http://diamondval-latest.onrender.com

/api/process-sealing/update?id=${id}&type=${type}`
      )
      .then(function (response) {
        setIsUpdated(true);
        console.log(response.data);
      });
  };
  useEffect(() => {
    viewSealingLetter();
  }, []);
  useEffect(() => {
    if (isUpdated) {
      viewSealingLetter();
      setIsUpdated(false);
    }
  }, [isUpdated]);
  return (
    <>
      <TableContainer>
        <Table size={"sm"} colorScheme="blue">
          <Thead bg={"blue.400"}>
            <Tr>
              <Th>No</Th>
              <Th>Content</Th>
              <Th>Status</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sealingLetter.map((item, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{item?.sealingLetterContent.slice(0, 40) || "N/A"}...</Td>
                <Td>{item?.status || "N/A"}</Td>
                <Td>
                  <IconButton
                    icon={<ViewIcon />}
                    bgColor={"transparent"}
                    onClick={() => {
                      setSelectedSealingLetter(item);
                      viewSealingLetterDetail.onOpen();
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal
        isOpen={viewSealingLetterDetail.isOpen}
        onClose={viewSealingLetterDetail.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Sealing Letter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={"column"} gap={5}>
              <Text>
                Content: {selectedSealingLetter?.sealingLetterContent || "N/A"}
              </Text>
              <Text>Status: {selectedSealingLetter?.status || "N/A"}</Text>
              <Text>
                Sealing date:{" "}
                {selectedSealingLetter?.valuationRequestSealingDate || "N/A"}
              </Text>
              <Text fontWeight={"bold"}>Customer</Text>
              <Text>Name: {selectedSealingLetter?.customerName || "N/A"}</Text>
              <Text fontWeight={"bold"}>Service</Text>
              <Text>Type: {selectedSealingLetter?.serviceName || "N/A"}</Text>
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent={"space-around"}>
            {(selectedSealingLetter?.status === "Not resolved yet" && (
              <>
                <Button
                  colorScheme="green"
                  onClick={() => {
                    viewSealingLetterDetail.onClose();
                    handleAcceptSealing(selectedSealingLetter.id, "accept");
                  }}
                >
                  Accept
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    viewSealingLetterDetail.onClose();
                    handleAcceptSealing(selectedSealingLetter.id, "reject");
                  }}
                >
                  Reject
                </Button>
              </>
            )) ||
              (selectedSealingLetter?.status === "Accepted" && (
                <>
                  <Button
                    colorScheme="green"
                    onClick={() => {
                      viewSealingLetterDetail.onClose();
                      viewSealingLetterPrint.onOpen();
                    }}
                  >
                    View Sealing Letter
                  </Button>
                </>
              ))}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={viewSealingLetterPrint.isOpen}
        onClose={viewSealingLetterPrint.onClose}
        size={"full"}
      >
        <ModalOverlay />
        <ModalContent ref={componentRef}>
          <ModalHeader>
            <Flex direction={"row"} alignItems={"center"}>
              <Icon as={GiDiamondTrophy} w={16} h={16} />
              <Text
                fontFamily={"The Nautigal"}
                fontSize="4xl"
                fontWeight={"bold"}
                m={"10px "}
              >
                DiamondVal
              </Text>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Flex
              direction={"column"}
              gap={5}
              border={"2px solid"}
              borderColor={"gray.200"}
              p={5}
            >
              <Center>
                <Text fontSize={"xl"} fontWeight={"bold"}>
                  Sealing Letter
                </Text>
              </Center>
              <Text>ID: {selectedSealingLetter?.id || "N/A"}</Text>
              <Text>
                Customer Name: {selectedSealingLetter?.customerName || "N/A"}
              </Text>
              <Text>
                Diamond ID: {selectedSealingLetter?.valuatedDiamondId || "N/A"}
              </Text>
              <Text>
                Sealed Date:{" "}
                {selectedSealingLetter?.valuationRequestSealingDate?.slice(
                  0,
                  10
                ) || "N/A"}
              </Text>
              <Text>
                Created date{" "}
                {selectedSealingLetter?.createSealingLetterDate?.slice(0, 10)}
              </Text>
              <Text>{selectedSealingLetter?.sealingLetterContent}.</Text>
              <Flex direction={"column"} align={"end"}>
                <Text>
                  Manager name:{" "}
                  <strong>{selectedSealingLetter?.managerName}</strong>
                </Text>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handlePrint}>Print</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
