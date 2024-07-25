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

export default function DashBoardLayout({ children }) {
  const bgColor = useColorModeValue("white", "white");
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
            <Box color={"black"} flex="1" pt={"20px"} mr={"60px"}>
              {children}
            </Box>
          </>
        ) : (
          <>
            <Box w="250px">
              <SideBar />
            </Box>
            <Box color={"black"} flex="1" bg={bgColor} px={20} alignItems={"center"}>
              {children}
            </Box>
          </>
        )}
      </Flex>
    </>
  );
}
