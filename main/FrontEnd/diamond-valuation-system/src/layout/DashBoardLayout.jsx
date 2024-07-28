import React, { useContext, useEffect } from "react";
import SideBar from "./sidebar/SideBar";
import {
  Box,
  Container,
  Flex,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import Logout from "../pages/logout/Logout";
import { useNavigate } from "react-router-dom";
import DarkModeButton from "../components/DarkModeButton";

export default function DashBoardLayout({ children }) {
  const bgColor = useColorModeValue("white", "gray.900");
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user") === null) {
      navigate("/");
    }
  });
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <>
      <Flex width={"100vw"} minHeight={"100vh"} bg={bgColor}>
        {isMobile ? (
          <>
            <SideBar />
            <Box flex="1" pt={"20px"} mr={"60px"}>
              {children}
            </Box>
          </>
        ) : (
          <>
            <Box w="250px">
              <SideBar />
            </Box>
            <Box flex="1" bg={bgColor} px={20} alignItems={"center"}>
              {children}
            </Box>
          </>
        )}
        <Flex position={"fixed"} right={"10px"} top={"10px"}>
          <DarkModeButton/>
        </Flex>
      </Flex>
    </>
  );
}
