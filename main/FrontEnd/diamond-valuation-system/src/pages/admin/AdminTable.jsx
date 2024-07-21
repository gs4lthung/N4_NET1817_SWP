import { ViewIcon } from "@chakra-ui/icons";
import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  IconButton,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { GrUpdate } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineNoAccounts } from "react-icons/md";

export default function AdminTable({
  accounts,
  setCurrentAcc,
  viewUser,
  setUpdateAcc,
  updateUser,
  setDeleteId,
  confirmDeleteUser,
}) {
  const bgHoverColor = useColorModeValue("gray.100", "gray.700");
  return (
    <>
      <TableContainer
        display={{ base: "block", md: "none", lg: "none" }}
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
              <Tr key={index} _hover={{ bg: "gray.100" }}>
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
                        viewUser.onOpen();
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
        display={{ base: "none", md: "block", lg: "block" }}
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
              <Th>Update</Th>
              <Th>Inactive</Th>
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
                      aria-label="update user"
                      icon={<GrUpdate />}
                      bgColor={"transparent"}
                      onClick={() => {
                        setUpdateAcc(account);
                        updateUser.onOpen();
                      }}
                    />
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <IconButton
                      aria-label="delete user"
                      icon={<MdOutlineNoAccounts size={25} color="red" />}
                      bgColor={"transparent"}
                      onClick={() => {
                        setDeleteId(account.id);
                        confirmDeleteUser.onOpen();
                      }}
                    />
                  </Center>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
