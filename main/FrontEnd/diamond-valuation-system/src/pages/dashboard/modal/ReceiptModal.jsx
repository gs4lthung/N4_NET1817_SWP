import React, { useContext, useEffect, useState } from "react";
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
    Thead,
    Tbody,
    Th,
    Td,
    UnorderedList,
    ListItem,
    TableContainer,
    Table,
    Tr,
    SimpleGrid,
    Image,
} from "@chakra-ui/react";
import { GiDiamondTrophy } from "react-icons/gi";
import { format, parseISO } from "date-fns";
import { UserContext } from "../../../components/GlobalContext/AuthContext";
import { fetchPendingRequestImagesByProcessRequestId } from "../../../service/ProcessRequestService";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage, lazyload, placeholder } from "@cloudinary/react";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
export default function ReceiptModal({
    viewReceipt,
    selectedValuationReceipt,
}) {
    const user = useContext(UserContext);
    const isUsers =
        user.userAuth &&
        user.userAuth.authorities &&
        user.userAuth.authorities.length > 0;
    const [diamondImages, setDiamondImages] = useState([]);
    const cld = new Cloudinary({
        cloud: {
            cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        },
    });
    useEffect(() => {
        if (selectedValuationReceipt) {
            console.log(selectedValuationReceipt);
            fetchPendingRequestImagesByProcessRequestId(
                selectedValuationReceipt?.processRequestId,
                setDiamondImages
            );
        }
    }, [selectedValuationReceipt]);
    return (
        <Modal
            isOpen={viewReceipt.isOpen}
            onClose={viewReceipt.onClose}
            size={"full"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Skeleton isLoaded={selectedValuationReceipt !== null}>
                        <Flex gap={5}>
                            <Icon as={GiDiamondTrophy} w={16} h={16} />
                            <Text fontFamily={"The Nautigal"} fontSize={"5xl"}>
                                DiamondVal
                            </Text>
                        </Flex>
                    </Skeleton>
                </ModalHeader>
                <ModalBody>
                    <Skeleton isLoaded={selectedValuationReceipt !== null}>
                        <Flex direction={"column"} gap={5} p={5}>
                            <Flex direction={"column"} align={"center"} gap={5}>
                                <Text fontSize={"3xl"} fontWeight={"bold"}>
                                    Receipt
                                </Text>
                            </Flex>
                            <Text>
                                <strong>ID</strong>:{" "}
                                {selectedValuationReceipt?.id || "N/A"}
                            </Text>
                            <Flex gap={10}>
                                <Flex
                                    direction={"column"}
                                    align={"start"}
                                    gap={5}
                                >
                                    <Text>
                                        <strong>Company</strong>: DiamondVal
                                    </Text>
                                    <Text>
                                        <strong>Date</strong>:{" "}
                                        {selectedValuationReceipt?.createdDate
                                            ? format(
                                                  parseISO(
                                                      selectedValuationReceipt?.createdDate
                                                  ),
                                                  "dd/MM/yyyy - HH:mm:ss"
                                              )
                                            : "N/A"}
                                    </Text>
                                    <Text>
                                        <strong>RE</strong>: Diamond Valuation
                                        Receipt
                                    </Text>
                                </Flex>
                                <Flex
                                    direction={"column"}
                                    align={"start"}
                                    gap={5}
                                >
                                    <Text>
                                        <strong>Transaction No</strong>:{" "}
                                        {selectedValuationReceipt?.transactionNo ||
                                            "N/A"}
                                    </Text>
                                    <Text>
                                        <strong>Payment Date</strong>:{" "}
                                        {selectedValuationReceipt?.paymentDate
                                            ? format(
                                                  parseISO(
                                                      selectedValuationReceipt?.paymentDate
                                                  ),
                                                  "dd/MM/yyyy - HH:mm:ss"
                                              )
                                            : "N/A"}
                                    </Text>
                                    <Text>
                                        <strong>Bank</strong>:{" "}
                                        {selectedValuationReceipt?.bank ||
                                            "N/A"}
                                    </Text>
                                </Flex>
                                <Flex
                                    direction={"column"}
                                    align={"start"}
                                    gap={5}
                                >
                                    <Text>
                                        <strong>Amount</strong>:{" "}
                                        {new Intl.NumberFormat("vi-VN").format(
                                            selectedValuationReceipt?.amount
                                        )}{" "}
                                        VND
                                    </Text>
                                    <Text>
                                        <strong>Order Info</strong>:{" "}
                                        {selectedValuationReceipt?.orderInfo ||
                                            "N/A"}
                                    </Text>
                                </Flex>
                            </Flex>

                            <Text>We include: </Text>
                            <Flex gap={10}>
                                <Flex
                                    direction={"column"}
                                    align={"start"}
                                    gap={5}
                                >
                                    <Text fontWeight={"bold"}>
                                        Customer side (Send diamond)
                                    </Text>
                                    <UnorderedList spacing={2}>
                                        <ListItem>
                                            Name:{" "}
                                            {selectedValuationReceipt?.customerName ||
                                                "N/A"}
                                        </ListItem>
                                        <ListItem>
                                            Phone Number:{" "}
                                            {selectedValuationReceipt?.customerPhone ||
                                                "N/A"}
                                        </ListItem>
                                    </UnorderedList>
                                </Flex>
                                <Flex
                                    direction={"column"}
                                    align={"start"}
                                    gap={5}
                                >
                                    <Text fontWeight={"bold"}>
                                        Company side (Receive diamond)
                                    </Text>
                                    <UnorderedList spacing={2}>
                                        <ListItem>
                                            Name:{" "}
                                            {selectedValuationReceipt?.consultingStaffName ||
                                                "N/A"}
                                        </ListItem>
                                        <ListItem>
                                            Phone Number:{" "}
                                            {selectedValuationReceipt?.consultingStaffPhone ||
                                                "N/A"}
                                        </ListItem>
                                    </UnorderedList>
                                </Flex>
                            </Flex>
                            <Text>
                                Both are agree to about give and receive the
                                diamond below
                            </Text>
                            <TableContainer>
                                <Table size={"sm"} colorScheme="blue">
                                    <Thead bg={"blue.400"}>
                                        <Tr>
                                            <Th>No</Th>
                                            <Th>Type</Th>
                                            <Th>Quantity</Th>
                                            <Th>Description</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>1</Td>
                                            <Td>Diamond</Td>
                                            <Td>1</Td>
                                            <Td>
                                                {selectedValuationReceipt?.description ||
                                                    "N/A"}
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <SimpleGrid columns={4} spacing={5}>
                                {diamondImages.map((image, index) => {
                                    return (
                                        <Flex direction={"column"} key={index}>
                                            <AdvancedImage
                                                cldImg={cld
                                                    .image(image)
                                                    .resize(
                                                        thumbnail()
                                                            .width(200)
                                                            .height(200)
                                                    )}
                                                plugins={[
                                                    lazyload(),
                                                    placeholder({
                                                        mode: "blur",
                                                    }),
                                                ]}
                                            />
                                        </Flex>
                                    );
                                })}
                            </SimpleGrid>
                            <Text>
                                Company side confirmed that Customer side has
                                given to Company side the right diamond with
                                that quantity.
                            </Text>
                            <Text>
                                Both are agreed to the above information and
                                signed below & the receipt will be copied for
                                both sides. Each will receive a copy and they
                                both have the same validity.
                            </Text>
                            <Flex justify={"space-between"} p={10} pb={0}>
                                <Flex
                                    direction={"column"}
                                    align={"start"}
                                    gap={5}
                                >
                                    <Text>Customer side</Text>
                                    <Text>Signature</Text>
                                </Flex>
                                <Flex
                                    direction={"column"}
                                    align={"end"}
                                    gap={5}
                                >
                                    <Text>Company side</Text>
                                    <Text>Signature</Text>
                                </Flex>
                            </Flex>
                            <Flex
                                justifyContent={"space-between"}
                                p={10}
                                pt={0}
                                px={0}
                            >
                                <Text></Text>
                                <Text w={"200px"} height={"100px"}>
                                    <Image w={"100%"} height={"100%"} src="/images/Signature.png" />
                                    <Text fontWeight={"bold"} fontSize={"xl"} ml={3}>Nguyen Anh Tuan</Text>
                                </Text>
                            </Flex>
                        </Flex>
                    </Skeleton>
                </ModalBody>
                <ModalFooter>
                    <Skeleton isLoaded={selectedValuationReceipt !== null}>
                        <Flex justify={"flex-end"} p={5}>
                            {isUsers &&
                                user.userAuth.authorities[0].authority ===
                                    "Consulting staff" && (
                                    <Button
                                        onClick={() => {
                                            window.print();
                                        }}
                                    >
                                        Print
                                    </Button>
                                )}
                        </Flex>
                    </Skeleton>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
