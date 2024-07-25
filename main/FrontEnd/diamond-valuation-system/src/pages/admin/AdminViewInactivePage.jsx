import React, { useEffect, useState } from "react";
import { viewInactiveAccount } from "./AdminServices";
import {
    TableContainer,
    Table,
    Tbody,
    Th,
    Thead,
    Tr,
    Td,
    IconButton,
    Center,
    useColorModeValue,
    useToast,
    useDisclosure,
    Flex,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { FaUserCheck } from "react-icons/fa";
import { adminActiveAccount } from "../../service/AdminActiveAccount";
import { motion } from "framer-motion";
import PageIndicator from "../../components/PageIndicator";
export default function AdminViewInactivePage() {
    const bgHoverColor = useColorModeValue("gray.100", "gray.700");
    const [accounts, setAccounts] = useState([]);
    const [currentAcc, setCurrentAcc] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [active, setActive] = useState({});
    const [totalPage, setTotalPage] = useState(null);
    const [filter, setFilter] = useState("");
    const toast = useToast();
    const activeUser = useDisclosure();
    const pageIndicator = [];
    useEffect(() => {
        viewInactiveAccount(
            "",
            currentPage,
            "",
            setAccounts,
            setTotalPage,
            toast
        );
    }, [currentPage]);

    const handleActivateUser = async () => {
        try {
            const result = await adminActiveAccount(active);
            if (result?.errMsg) {
                activeUser.onClose();
                toast({
                    title: "Error activating user.",
                    description: error.message,
                    status: "error",
                    position: "top-right",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                activeUser.onClose();
                toast({
                    title: "User activated.",
                    description: "The user has been successfully activated.",
                    status: "success",
                    position: "top-right",
                    duration: 3000,
                    isClosable: true,
                });
                setAccounts(
                    accounts.filter((account) => account.id !== active)
                );
            }
        } catch (error) {
            toast({
                title: "Error activating user.",
                description: error.message,
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });
        }
    };
    for (let i = 1; i <= totalPage; i++) {
        pageIndicator.push(
            <Button
                key={i}
                mb={"12px"}
                colorScheme="teal"
                variant="outline"
                onClick={() => {
                    setCurrentPage(i);
                    console.log("current:" + currentPage);
                }}
            >
                {i}
            </Button>
        );
    }
    return (
        <>
            <TableContainer
                display={{ base: "block", md: "none" }}
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
                <Table variant={"unstyled"}>
                    <Thead>
                        <Tr>
                            <Th>No</Th>
                            <Th>Role</Th>
                            <Th>Full Name</Th>
                            <Th>View</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {accounts.map((account, index) => (
                            <Tr
                                key={index}
                                as={motion.tr}
                                whileHover={{ scale: 1.02 }}
                                transition="0.1s linear"
                                _hover={{ bg: bgHoverColor }}
                            >
                                <Td>{index + 1}</Td>
                                <Td>{account?.roleName}</Td>
                                <Td>{account?.fullName}</Td>
                                <Td>
                                    <Center>
                                        <IconButton
                                            aria-label="view user"
                                            icon={<ViewIcon />}
                                            bgColor={"transparent"}
                                            onClick={() => {
                                                setCurrentAcc(account);
                                            }}
                                        />
                                    </Center>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <TableContainer
                display={{ base: "none", md: "block" }}
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
                <Table variant={"unstyled"}>
                    <Thead>
                        <Tr>
                            <Th>No</Th>
                            <Th>Role</Th>
                            <Th>Username</Th>
                            <Th>Password</Th>
                            <Th>Full Name</Th>
                            <Th>Email</Th>
                            <Th>Phone number</Th>
                            <Th>Address</Th>
                            <Th>Active</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {accounts.map((account, index) => (
                            <Tr
                                key={index}
                                as={motion.tr}
                                whileHover={{ scale: 1.02 }}
                                transition="0.1s linear"
                                _hover={{ bg: bgHoverColor }}
                            >
                                <Td>{index + 1}</Td>
                                <Td>{account?.roleName}</Td>
                                <Td>{account?.username}</Td>
                                <Td>***</Td>
                                <Td>{account?.fullName}</Td>
                                <Td>{account?.email}</Td>
                                <Td>{account?.phoneNumber}</Td>
                                <Td
                                    overflow={"hidden"}
                                    textOverflow={"ellipsis"}
                                    maxW={"300px"}
                                >
                                    {account?.address}
                                </Td>
                                <Td>
                                    <Center>
                                        <IconButton
                                            aria-label="activate user"
                                            icon={<FaUserCheck />}
                                            bgColor={"transparent"}
                                            onClick={() => {
                                                setActive(account.id);
                                                activeUser.onOpen();
                                            }}
                                        />
                                    </Center>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Center>
                <PageIndicator
                    totalPages={totalPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </Center>
            <Modal isOpen={activeUser.isOpen} onClose={activeUser.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Activate User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to activate this user?
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={handleActivateUser}
                        >
                            Confirm
                        </Button>
                        <Button variant="ghost" onClick={activeUser.onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
