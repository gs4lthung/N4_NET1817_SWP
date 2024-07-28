import {
  Flex,
  Text,
  Stack,
  Box,
  Container,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import routes from "../config/Config";
import { GiDiamondTrophy } from "react-icons/gi";
import { Icon } from "@chakra-ui/icons";
import { FaFacebook } from "react-icons/fa";
export default function Footer() {
  const bgColor = useColorModeValue("white", "black");
  const fontColor = useColorModeValue("black", "#DBA843");
  return (
    <>
      <Box
        bg={useColorModeValue("gray.200", "gray.900")}
        color={fontColor}
      >
        <Container as={Stack} maxW={"9xl"}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} p={10} gap={10}>
            <Stack align={"flex-start"}>
              <Flex direction={"row"} align={"center"}>
                <Icon
                  as={GiDiamondTrophy}
                  w={{ base: 5, md: 8, lg: 10 }}
                  h={{ base: 5, md: 8, lg: 10 }}
                />
                <Text
                  fontFamily={"The Nautigal"}
                  fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                  fontWeight={"bold"}
                  m={"10px "}
                >
                  DiamondVal
                </Text>
              </Flex>
              <Text fontSize={"sm"}>DiamondVal for diamond valuation</Text>
            </Stack>
            <Stack align={"flex-start"}>
              <Text fontWeight={"bold"} fontSize={"lg"}>
                Features
              </Text>
              <Link to={routes.diamondCheck}>
                <Text _hover={{ textDecoration: "underline" }}>
                  Diamond Check
                </Text>
              </Link>
              <Link to={routes.diamondCalculate}>
                <Text _hover={{ textDecoration: "underline" }}>Valuation</Text>
              </Link>
              <Link to={routes.prices}>
                <Text _hover={{ textDecoration: "underline" }}>Price</Text>
              </Link>
            </Stack>
            <Stack align={"flex-start"}>
              <Text fontWeight={"bold"} fontSize={"lg"}>
                Mores
              </Text>
              <Link to={routes.educationCarat}>
                <Text _hover={{ textDecoration: "underline" }}>Carat</Text>
              </Link>
              <Link to={routes.educationCertificate}>
                <Text _hover={{ textDecoration: "underline" }}>
                  Diamond Certificate
                </Text>
              </Link>
              <Link to={routes.educationClarity}>
                <Text _hover={{ textDecoration: "underline" }}>Clarity</Text>
              </Link>
              <Link to={routes.educationColor}>
                <Text _hover={{ textDecoration: "underline" }}>
                  Diamond Color
                </Text>
              </Link>
              <Link to={routes.educationCut}>
                <Text _hover={{ textDecoration: "underline" }}>Cut</Text>
              </Link>
            </Stack>
            <Stack align={"flex-start"}>
              <Text fontWeight={"bold"} fontSize={"lg"}>
                Company
              </Text>
              <Link to={routes.aboutUs}>
                <Text _hover={{ textDecoration: "underline" }}>About us</Text>
              </Link>
              <Link to={routes.FAQs}>
                <Text _hover={{ textDecoration: "underline" }}>FAQs</Text>
              </Link>
            </Stack>
          </SimpleGrid>
        </Container>
        <Box borderTopWidth={1} borderStyle={"solid"} borderColor={"gray.700"}>
          <Container
            as={Stack}
            maxW={"9xl"}
            py={4}
            direction={{ base: "column", md: "row", lg: "row" }}
            spacing={4}
            justify={{ md: "space-between" }}
            align={{ md: "center" }}
          >
            <Text>Copy right © 2024 DiamondVal. All rights reserved</Text>
            <Stack direction={"row"} spacing={6}>
              <FaFacebook />
            </Stack>
          </Container>
        </Box>
      </Box>
    </>
  );
}
