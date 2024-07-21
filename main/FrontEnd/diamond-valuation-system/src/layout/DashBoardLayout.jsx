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
  const bgColor = useColorModeValue("white", "gray.800");
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user") === null) {
      navigate("/");
    }
  });
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <>
      {/* <Flex width={"100vw"} minHeight={"100vh"} bg={bgColor}>
        <Box w="256px">
          <SideBar />
        </Box>
        <Box flex="1" bg={bgColor} px={5} pt={"120px"}>
          {children}
        </Box>
      </Flex> */}
      <Flex width={"100vw"} minHeight={"100vh"} bg={bgColor}>
        {isMobile ? (
          <>
              <SideBar/>  
            <Box flex="1" pt={"20px"} mr={"60px"}>
              {children}
            </Box>
          </>
        ) : (
          <>
            <Box w="256px">
              <SideBar />
            </Box>
            <Box flex="1" bg={bgColor} px={5} pt={"120px"}>
              {children}
            </Box>
          </>
        )}
      </Flex>
    </>
  );
}
