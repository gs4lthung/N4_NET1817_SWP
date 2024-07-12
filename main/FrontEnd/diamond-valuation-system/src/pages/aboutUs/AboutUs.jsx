import {
  Heading,
  Box,
  Text,
  Flex,
  Center,
  Button,
  useToast,
} from "@chakra-ui/react";
import React from "react";

export default function AboutUs() {
  const toast = useToast();
  return (
    <Center h={"80vh"}>
      <Box w={"80vw"}>
        <Box textAlign={"center"} p={15}>
          <Heading>About Diamond Valuation</Heading>
        </Box>
        <Flex w={"100%"} fontSize={20}>
          <Box w={"50%"} m={"30px 10px"}>
            <Text>
              DiamondVal began as a personal quest to find the right diamond at
              a fair price. Nowadays we're helping our users discover their
              perfect diamond at the lowest price from the top online jewelers.
              Every day we algorithmically search through millions of diamonds
              to find the best deals without compromising on quality.
            </Text>
            <br />
            <Text>
              Our business model is similar to Kayak or SeatGeek: it's free for
              you (the user) and we only collect a small fee from the services
              for your diamond valuation request. We've experienced firsthand
              how stressful this search process can be. Our goal is to make
              pricing and searching easier for you and to align our interests
              with yours.
            </Text>
            <br />
            <Button
              colorScheme="blue"
              onClick={() => {
                toast({
                  title: "Hello my friend !!!",
                  description: "Thank you for visiting us.",
                  position:"top",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              }}
            >
              SAY HI !
            </Button>
          </Box>
          <Box w={"50%"} m={"30px 10px"}>
            <Text>
              DiamondVal is dedicated to providing the best and easiest services
              to value your perfect diamond. If there is anything we can do to
              improve your online diamond valuation experience, please let us
              know.
            </Text>
          </Box>
        </Flex>
      </Box>
    </Center>
  );
}
