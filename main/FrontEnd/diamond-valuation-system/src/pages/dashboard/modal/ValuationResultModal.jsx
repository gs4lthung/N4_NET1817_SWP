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
  UnorderedList,
  ListItem,
  useColorModeValue,
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
                <Flex direction={"column"} bg={useColorModeValue("blue.100","blue.500")} gap={5} p={5}>
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
                  <Text>
                    <strong>Origin: </strong>
                    {selectedValuationResult?.origin}
                  </Text>

                  <Text>
                    <strong>Shape: </strong>
                    {selectedValuationResult?.shape}
                  </Text>
                  <Text>
                    <strong>Measurements: </strong>
                    {selectedValuationResult?.length} -{" "}
                    {selectedValuationResult?.width} x{" "}
                    {selectedValuationResult?.depth} mm
                  </Text>
                  <Text>
                    <strong>Price: </strong>
                    {selectedValuationResult?.price} $
                  </Text>
                  <Text fontWeight={"bold"} bg={"blue.400"} p={2}>
                    4C GRADING REPORT
                  </Text>

                  <Text>
                    <strong>Carat: </strong>
                    {selectedValuationResult?.carat}
                  </Text>

                  <Text>
                    <strong>Color: </strong>
                    {selectedValuationResult?.color}
                  </Text>

                  <Text>
                    <strong>Cut: </strong>
                    {selectedValuationResult?.cut}
                  </Text>

                  <Text>
                    <strong>Clarity: </strong>
                    {selectedValuationResult?.clarity}
                  </Text>
                </Flex>
                <Flex direction={"column"} gap={5} bg={useColorModeValue("blue.100","blue.500")} p={5}>
                  <Text fontWeight={"bold"} bg={"blue.400"} p={2}>
                    ADDITIONAL GRADING INFORMATION
                  </Text>

                  <Text>
                    <strong>Symmetry: </strong>
                    {selectedValuationResult?.symmetry}
                  </Text>

                  <Text>
                    <strong>Polish: </strong>
                    {selectedValuationResult?.polish}
                  </Text>

                  <Text>
                    <strong>Fluorescence: </strong>
                    {selectedValuationResult?.fluorescence}
                  </Text>
                  <Text fontWeight={"bold"} bg={"blue.400"} p={2}>
                    Clarity Characteristics
                  </Text>
                  <UnorderedList spacing={2}>
                    {selectedValuationResult?.laserDrillHole && (
                      <ListItem>Laser Drill Hole</ListItem>
                    )}
                    {selectedValuationResult?.feather && (
                      <ListItem>Feather</ListItem>
                    )}
                    {selectedValuationResult?.crystal && (
                      <ListItem>Crystal</ListItem>
                    )}
                    {selectedValuationResult?.chip && <ListItem>Chip</ListItem>}
                    {selectedValuationResult?.needle && (
                      <ListItem>Needle</ListItem>
                    )}
                    {selectedValuationResult?.cavity && (
                      <ListItem>Cavity</ListItem>
                    )}
                    {selectedValuationResult?.pinpoint && (
                      <ListItem>Pinpoint</ListItem>
                    )}
                    {selectedValuationResult?.bruise && (
                      <ListItem>Bruise</ListItem>
                    )}
                    {selectedValuationResult?.cloud && (
                      <ListItem>Cloud</ListItem>
                    )}
                    {selectedValuationResult?.etchChannel && (
                      <ListItem>Etch Channel</ListItem>
                    )}
                    {selectedValuationResult?.twinningWisp && (
                      <ListItem>Twinning Wisp</ListItem>
                    )}
                    {selectedValuationResult?.identedNatural && (
                      <ListItem>Indented Natural</ListItem>
                    )}
                    {selectedValuationResult?.knot && <ListItem>Knot</ListItem>}
                    {selectedValuationResult?.natural && (
                      <ListItem>Natural</ListItem>
                    )}
                  </UnorderedList>
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
