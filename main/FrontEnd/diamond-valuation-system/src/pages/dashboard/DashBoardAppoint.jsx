import { IoIosCreate } from "react-icons/io";
import { Box, Button, StackDivider, Text, VStack } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { viewCustomerRequest } from "../../service/ViewRequest";
import { UserContext } from "../../components/GlobalContext/AuthContext";

export default function DashBoardAppoint() {
    const user = useContext(UserContext);
    useEffect(() => {
        const fetchApi = async(id) => {
            const result = await viewCustomerRequest(id);
            console.log(result);
        }
        fetchApi(user.userAuth.id);
    },[])
    return (
        <div>
            <Box bg="rgb(67 56 202)" w="100%" pl={1} color="white">
                <Text py={3} fontSize="lg" pl={"20px"}>
                    APPOINTMENTS
                </Text>
                <VStack
                    pl={4}
                    background={"rgb(239 246 255)"}
                    divider={<StackDivider borderColor="gray.200" />}
                    spacing={1}
                    align="stretch"
                    justifyContent={"center"}
                >
                    <Box lineHeight={"40px"} h="40px" color={"#000"}>
                        There's one appointment
                    </Box>
                    <Box lineHeight={"40px"} h="40px" color={"#000"}>
                        There's one appointment
                    </Box>
                    <Box lineHeight={"40px"} h="40px" color={"#000"}>
                        There's one appointment
                    </Box>
                </VStack>
            </Box>
        </div>
    );
}
