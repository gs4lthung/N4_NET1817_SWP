import React, { useContext, useRef } from "react";
import { UserContext } from "../../../components/GlobalContext/AuthContext";
import { useReactToPrint } from "react-to-print";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  Icon,
  Text,
  Skeleton,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { GiDiamondTrophy } from "react-icons/gi";
import { format, parseISO } from "date-fns";
export default function ValuationResultModal({
  viewValuationResult,
  selectedValuationResult,
}) {
  const user = useContext(UserContext);
  const isUsers =
    user.userAuth &&
    user.userAuth.authorities &&
    user.userAuth.authorities.length > 0;
  const valuationResultRef = useRef();
  const handlePrintValuationResult = useReactToPrint({
    content: () => valuationResultRef.current,
  });
  return (
    <Modal
      isOpen={viewValuationResult.isOpen}
      onClose={viewValuationResult.onClose}
      size={"full"}
    >
      <ModalOverlay />
      <ModalContent ref={valuationResultRef} p={5}>
        <ModalHeader>
          <Skeleton isLoaded={selectedValuationResult !== null}>
            <Flex direction={"row"} gap={5}>
              <Icon as={GiDiamondTrophy} w={16} h={16} />
              <Text fontFamily={"The Nautigal"} fontSize={"5xl"}>
                DiamondVal
              </Text>
            </Flex>
          </Skeleton>
        </ModalHeader>
        <ModalBody>
          <Skeleton isLoaded={selectedValuationResult !== null}>
            <Flex direction={"column"} gap={2} p={5}>
              <Flex direction={"column"} align={"center"} gap={5}>
                <Text fontSize={"2xl"}>
                  <strong>Valuation Result ID</strong>:{" "}
                  {selectedValuationResult?.id || "N/A"}
                </Text>
              </Flex>
              <SimpleGrid columns={2} spacing={10}>
                <Flex direction={"column"} bg={"blue.100"} gap={5} p={5}>
                  <Text fontWeight={"bold"} bg={"blue.400"} p={2}>
                    GRADING REPORT
                  </Text>
                  <Text>
                    <strong>ID</strong>: {selectedValuationResult?.id}
                  </Text>
                  <Text>
                    <strong>Valuated Date</strong>:{" "}
                    {selectedValuationResult?.createdDate
                      ? format(
                          parseISO(selectedValuationResult?.createdDate),
                          "dd/MM/yyyy - HH:mm:ss"
                        )
                      : "N/A"}
                  </Text>
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Origin"
                  ) && (
                    <Text>
                      <strong>Origin: </strong>
                      {selectedValuationResult?.origin}
                    </Text>
                  )}
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Shape"
                  ) && (
                    <Text>
                      <strong>Shape: </strong>
                      {selectedValuationResult?.shape}
                    </Text>
                  )}
                  <Text>
                    <strong>Price: </strong>
                    {selectedValuationResult?.price} $
                  </Text>
                  <Text fontWeight={"bold"} bg={"blue.400"} p={2}>
                    4C GRADING REPORT
                  </Text>
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Carat"
                  ) && (
                    <Text>
                      <strong>Carat: </strong>
                      {selectedValuationResult?.carat}
                    </Text>
                  )}
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Color"
                  ) && (
                    <Text>
                      <strong>Color: </strong>
                      {selectedValuationResult?.color}
                    </Text>
                  )}
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Cut"
                  ) && (
                    <Text>
                      <strong>Cut: </strong>
                      {selectedValuationResult?.cut}
                    </Text>
                  )}
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Clarity"
                  ) && (
                    <Text>
                      <strong>Clarity: </strong>
                      {selectedValuationResult?.clarity}
                    </Text>
                  )}
                </Flex>
                <Flex direction={"column"} gap={5} bg={"blue.100"} p={5}>
                  <Text fontWeight={"bold"} bg={"blue.400"} p={2}>
                    ADDITIONAL GRADING INFORMATION
                  </Text>
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Symmetry"
                  ) && (
                    <Text>
                      <strong>Symmetry: </strong>
                      {selectedValuationResult?.symmetry}
                    </Text>
                  )}
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Polish"
                  ) && (
                    <Text>
                      <strong>Polish: </strong>
                      {selectedValuationResult?.polish}
                    </Text>
                  )}
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Fluorescence"
                  ) && (
                    <Text>
                      <strong>Fluorescence: </strong>
                      {selectedValuationResult?.fluorescence}
                    </Text>
                  )}
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Measurements"
                  ) && (
                    <Text>
                      <strong>Measurements: </strong>
                      {selectedValuationResult?.measurements}
                    </Text>
                  )}
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Table"
                  ) && (
                    <Text>
                      <strong>Table: </strong>
                      {selectedValuationResult?.diamondTable}
                    </Text>
                  )}
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "Depth"
                  ) && (
                    <Text>
                      <strong>Depth: </strong>
                      {selectedValuationResult?.depth}
                    </Text>
                  )}
                  {selectedValuationResult?.serviceStatistic?.includes(
                    "L/W Ratio"
                  ) && (
                    <Text>
                      <strong>L/W Ratio: </strong>
                      {selectedValuationResult?.lengthToWidthRatio}
                    </Text>
                  )}
                </Flex>
              </SimpleGrid>
            </Flex>
          </Skeleton>
        </ModalBody>
        <ModalFooter justifyContent={"space-around"}>
          {isUsers &&
            user.userAuth.authorities[0].authority === "Consulting staff" && (
              <Skeleton isLoaded={selectedValuationResult !== null}>
                <Button onClick={handlePrintValuationResult}>Print</Button>
              </Skeleton>
            )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
