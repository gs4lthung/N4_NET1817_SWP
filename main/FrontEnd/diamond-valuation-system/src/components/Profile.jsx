import React ,{useContext} from "react";
import { Flex,WrapItem,Avatar,Text } from "@chakra-ui/react";
import { UserContext } from "./GlobalContext/AuthContext";
export default function Profile() {
    const auth = useContext(UserContext);
  return (
    <>
      <Flex align={"center"} p={3} pr={0} bg={"rgb(229 231 235)"}>
        <WrapItem mr={3}>
          <Avatar
            name={auth.userAuth.fullname}
            src="https://bit.ly/tioluwani-kolawole"
          />
        </WrapItem>
        <Text color={"#000"}>{auth.userAuth.fullname}</Text>
      </Flex>
    </>
  );
}
