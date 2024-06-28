import React, { useContext } from "react";
import SideBar from "./sidebar/SideBar";
import { Box, Flex } from "@chakra-ui/react";

export default function DashBoardLayout({ children }) {
    return (
        <Flex width={"100%"} height={"100vh"} bg={"rgb(243 244 246)"}>
            <Box w="256px">
                <SideBar />
            </Box>
            <Box flex="1" bg="#fff" px={5} pt={"120px"}>
                {children}
            </Box>
        </Flex>
    );
}
