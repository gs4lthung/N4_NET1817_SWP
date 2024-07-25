import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  ListItem,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  UnorderedList,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage, lazyload, placeholder } from "@cloudinary/react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import routes from "../../config/Config";
import { format, parseISO } from "date-fns";
import { pixelate, vignette } from "@cloudinary/url-gen/actions/effect";
import { GrNotes } from "react-icons/gr";
export default function DiamondCheckDetails() {
  const navigate = useNavigate();
  const toast = useToast();
  const { valuationResultId } = useParams();
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
  });
  const bgColor = useColorModeValue("white", "black");
  const bgColor1 = useColorModeValue("blue.400", "#DBA843");
  const forntColor = useColorModeValue("black", "white");
  const bgColor2 = useColorModeValue("rgb(45, 84, 119)", "#DBA843");
  const [diamond, setDiamond] = useState({});
  const [diamondImages, setDiamondImages] = useState([]);

  const fetchValuationResult = (id) => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/valuation-result/get?id=${id}`
      )
      .then(function (response) {
        if (response.data === null) {
          setTimeout(() => {
            toast({
              title: "Error",
              description: "Diamond not found",
              position: "top-right",

              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }, 2000);
          setTimeout(() => {
            navigate(routes.diamondCheck);
          }, 3000);
        }
        console.log(response.data);
        setDiamond(response.data);
      })
      .catch(function (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Diamond not found",
          position: "top-right",

          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };
  const fetchValuatedDiamondImages = (valuationResultId) => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/valuation-result/image/get?id=${valuationResultId}`
      )
      .then(function (response) {
        console.log(response.data);
        setDiamondImages(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    console.log(valuationResultId);
    fetchValuationResult(valuationResultId);
    fetchValuatedDiamondImages(valuationResultId);
    console.log(diamondImages);
  }, []);
  return (
    <Box bg={bgColor} paddingBottom={10} paddingTop={10}>
      <Grid templateColumns="repeat(2, 1fr)" p={10}>
        <GridItem
          colSpan={1}
          display={"flex"}
          height={"50vh"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <SimpleGrid
            columns={{
              lg:
                (diamondImages.length === 1 && 1) ||
                (diamondImages.length === 2 && 2) ||
                Math.ceil(diamondImages.length / 2),
            }}
            spacing={10}
            justifyContent={"center"}
          >
            {diamondImages?.map((image, index) => {
              return (
                <AdvancedImage
                  key={index}
                  cldImg={cld
                    .image(image)
                    .resize(thumbnail().width(500).height(500))}
                  plugins={[lazyload(), placeholder({ mode: "blur" })]}
                />
              );
            })}
          </SimpleGrid>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex direction={"column"} gap={5}>
            <Flex direction={"row"} alignItems={"center"} gap={5}>
              <Skeleton isLoaded={diamond !== null}>
                <Text fontSize="3xl" fontWeight={"bold"}>
                  ID {diamond?.id}
                </Text>
              </Skeleton>
              <Skeleton isLoaded={diamond !== null}>
                <Badge
                  color={"rgb(22 163 74)"}
                  fontSize={"xl"}
                  bg={bgColor}
                  border={"1px solid"}
                  p={"4px"}
                  px={"6px"}
                  borderRadius={"8px"}
                >
                  {diamond?.origin} Diamond
                </Badge>
              </Skeleton>
            </Flex>
            <Skeleton isLoaded={diamond !== null}>
              <Text fontSize="lg" color={"gray"}>
                Valuated Date:{" "}
                {diamond?.createdDate
                  ? format(parseISO(diamond?.createdDate), "dd/MM/yyyy HH:mm")
                  : "N/A"}
              </Text>
            </Skeleton>
            <UnorderedList>
              <ListItem fontSize={"lg"}>
                Fair Price Estimate:{" "}
                <Skeleton isLoaded={diamond !== null}>
                  <Text
                    display={"inline"}
                    color={bgColor1}
                    fontWeight={"bold"}
                    fontSize={"3xl"}
                  >
                    ${diamond?.price}
                  </Text>
                </Skeleton>
              </ListItem>
            </UnorderedList>
            <Center justifyContent={"flex-start"}>
              <Link to={routes.diamondCheck}>
                <Button
                  bg={bgColor1}
                  color={bgColor}
                  size={{ base: "sm", md: "md", lg: "lg" }}
                >
                  Run another check
                </Button>
              </Link>
            </Center>
            <Grid
              templateColumns="repeat(4, 1fr)"
              border={"2px solid"}
              borderRadius={"10px"}
              borderColor={bgColor1}
              p={5}
              gap={10}
            >
              <GridItem>
                <Text fontSize="md" fontWeight={"bold"} color={"gray"}>
                  Shape
                </Text>
                <Skeleton isLoaded={diamond !== null}>
                  <Text fontSize="xl" fontWeight={"bold"}>
                    {diamond?.shape || "N/A"}
                  </Text>
                </Skeleton>
              </GridItem>
              <GridItem>
                <Text fontSize="md" fontWeight={"bold"} color={"gray"}>
                  Carat
                </Text>
                <Skeleton isLoaded={diamond !== null}>
                  <Text fontSize="xl" fontWeight={"bold"}>
                    {diamond?.carat || "0"} ct.
                  </Text>
                </Skeleton>
              </GridItem>
              <GridItem>
                <Text fontSize="md" fontWeight={"bold"} color={"gray"}>
                  Color
                </Text>
                <Skeleton isLoaded={diamond !== null}>
                  <Text fontSize="xl" fontWeight={"bold"}>
                    {diamond?.color || "N/A"}
                  </Text>
                </Skeleton>
              </GridItem>
              <GridItem>
                <Text fontSize="md" fontWeight={"bold"} color={"gray"}>
                  Clarity
                </Text>
                <Skeleton isLoaded={diamond !== null}>
                  <Text fontSize="xl" fontWeight={"bold"}>
                    {diamond?.clarity || "N/A"}
                  </Text>
                </Skeleton>
              </GridItem>
              <GridItem>
                <Text fontSize="md" fontWeight={"bold"} color={"gray"}>
                  Symmetry
                </Text>
                <Skeleton isLoaded={diamond !== null}>
                  <Text fontSize="xl" fontWeight={"bold"}>
                    {diamond?.symmetry || "N/A"}
                  </Text>
                </Skeleton>
              </GridItem>
              <GridItem>
                <Text fontSize="md" fontWeight={"bold"} color={"gray"}>
                  Polish
                </Text>
                <Skeleton isLoaded={diamond !== null}>
                  <Text fontSize="xl" fontWeight={"bold"}>
                    {diamond?.polish || "N/A"}
                  </Text>
                </Skeleton>
              </GridItem>
              <GridItem>
                <Text fontSize="md" fontWeight={"bold"} color={"gray"}>
                  Fluorescence
                </Text>
                <Skeleton isLoaded={diamond !== null}>
                  <Text fontSize="xl" fontWeight={"bold"}>
                    {diamond?.fluorescence || "N/A"}
                  </Text>
                </Skeleton>
              </GridItem>
              <GridItem>
                <Text fontSize="md" fontWeight={"bold"} color={"gray"}>
                  Measurement
                </Text>
                <Skeleton isLoaded={diamond !== null}>
                  <Text fontSize="xl" fontWeight={"bold"}>
                    {diamond?.length} - {diamond?.width} x {diamond?.depth} mm
                  </Text>
                </Skeleton>
              </GridItem>
            </Grid>
          </Flex>
        </GridItem>
      </Grid>
      <Box mt={10}>
        <Container maxW="6xl" color="white">
          <HStack spacing="24px" justifyContent={"center"} mb={"40px"}>
            <Tag
              alignItems={"center"}
              p={"12px"}
              bg={bgColor}
              size={{ base: "sm", md: "md", lg: "lg" }}
            >
              <GrNotes style={{ marginRight: "12px" }} />
              Diamond Details
            </Tag>
          </HStack>
          <Skeleton isLoaded={diamond !== null}>
            <Grid templateColumns="repeat(2, 1fr)" gap={8} height={"100%"}>
              <GridItem colSpan={1} w="100%" h={"100%"}>
                <VStack>
                  <Box w={"100%"}>
                    <Box
                      fontWeight={"bold"}
                      fontSize={"small"}
                      bg={bgColor2}
                      p={"8px 0 8px 10px"}
                      mb={"8px"}
                      color={bgColor}
                    >
                      REPORT DETAILS
                    </Box>
                    <VStack direction={"column"}>
                      <Box w={"100%"}>
                        <Flex justifyContent={"space-between"}>
                          <Text color={"rgb(121 127 140)"} pl={"4px"}>
                            Certificate Date
                          </Text>
                          <Text color={forntColor} fontWeight={"bold"}>
                            {console.log(diamond)}
                            {diamond?.createdDate
                              ? format(
                                  parseISO(diamond?.createdDate),
                                  "dd/MM/yyyy"
                                )
                              : "N/A"}
                          </Text>
                        </Flex>
                      </Box>
                      <Box w={"100%"}>
                        <Flex justifyContent={"space-between"}>
                          <Text color={"rgb(121 127 140)"} pl={"4px"}>
                            Report Number
                          </Text>
                          <Text color={forntColor} fontWeight={"bold"}>
                            {diamond?.id}
                          </Text>
                        </Flex>
                      </Box>
                      <Box w={"100%"}>
                        <Flex justifyContent={"space-between"}>
                          <Text color={"rgb(121 127 140)"} pl={"4px"}>
                            Shape
                          </Text>
                          <Text color={forntColor} fontWeight={"bold"}>
                            {diamond?.shape}
                          </Text>
                        </Flex>
                      </Box>
                      <Box w={"100%"}>
                        <Flex justifyContent={"space-between"}>
                          <Text color={"rgb(121 127 140)"} pl={"4px"}>
                            Measurements
                          </Text>
                          <Text color={forntColor} fontWeight={"bold"}>
                            {diamond?.length} - {diamond?.width} x{" "}
                            {diamond?.depth} mm
                          </Text>
                        </Flex>
                      </Box>
                    </VStack>
                  </Box>
                  <Box w={"100%"}>
                    <Box
                      fontWeight={"bold"}
                      fontSize={"small"}
                      bg={bgColor2}
                      p={"8px 0 8px 10px"}
                      mb={"8px"}
                      color={bgColor}
                    >
                      GRADING RESULTS
                    </Box>
                    <VStack direction={"column"}>
                      <Box w={"100%"}>
                        <Flex justifyContent={"space-between"}>
                          <Text color={"rgb(121 127 140)"} pl={"4px"}>
                            Carat Weight
                          </Text>
                          <Text color={forntColor} fontWeight={"bold"}>
                            {diamond?.carat} carat
                          </Text>
                        </Flex>
                      </Box>
                      <Box w={"100%"}>
                        <Flex justifyContent={"space-between"}>
                          <Text color={"rgb(121 127 140)"} pl={"4px"}>
                            Color Grade
                          </Text>
                          <Text color={forntColor} fontWeight={"bold"}>
                            {diamond?.color}
                          </Text>
                        </Flex>
                      </Box>
                      <Box w={"100%"}>
                        <Flex justifyContent={"space-between"}>
                          <Text color={"rgb(121 127 140)"} pl={"4px"}>
                            Clarity Grade
                          </Text>
                          <Text color={forntColor} fontWeight={"bold"}>
                            {diamond?.clarity}
                          </Text>
                        </Flex>
                      </Box>
                      <Box w={"100%"}>
                        <Flex justifyContent={"space-between"}>
                          <Text color={"rgb(121 127 140)"} pl={"4px"}>
                            Cut Grade
                          </Text>
                          <Text color={forntColor} fontWeight={"bold"}>
                            {diamond?.cut}
                          </Text>
                        </Flex>
                      </Box>
                    </VStack>
                  </Box>
                  <Box w={"100%"}>
                    <Box
                      fontWeight={"bold"}
                      fontSize={"small"}
                      bg={bgColor2}
                      p={"8px 0 8px 10px"}
                      mb={"8px"}
                      color={bgColor}
                    >
                      ADDITIONAL GRADING INFORMATION
                    </Box>
                    <VStack direction={"column"}>
                      <Box w={"100%"}>
                        <Flex justifyContent={"space-between"}>
                          <Text color={"rgb(121 127 140)"} pl={"4px"}>
                            Polish
                          </Text>
                          <Text color={forntColor} fontWeight={"bold"}>
                            {diamond?.polish}
                          </Text>
                        </Flex>
                      </Box>
                      <Box w={"100%"}>
                        <Flex justifyContent={"space-between"}>
                          <Text color={"rgb(121 127 140)"} pl={"4px"}>
                            Symmetry
                          </Text>
                          <Text color={forntColor} fontWeight={"bold"}>
                            {diamond?.symmetry}
                          </Text>
                        </Flex>
                      </Box>
                      <Box w={"100%"}>
                        <Flex justifyContent={"space-between"}>
                          <Text color={"rgb(121 127 140)"} pl={"4px"}>
                            Fluorescence
                          </Text>
                          <Text color={forntColor} fontWeight={"bold"}>
                            {diamond?.fluorescence}
                          </Text>
                        </Flex>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </GridItem>
              <GridItem colSpan={1} w="100%" h={"100%"}>
                <VStack>
                  <Box w={"100%"}>
                    <Box
                      fontWeight={"bold"}
                      fontSize={"small"}
                      bg={bgColor2}
                      p={"8px 0 8px 10px"}
                      mb={"8px"}
                      color={bgColor}
                    >
                      PROPORTIONS DETAILS
                    </Box>
                    <Image
                      marginX={"auto"}
                      w={"230"}
                      height={"162"}
                      src="/images/diamond_attr.png"
                    />
                    <Grid templateColumns="repeat(5, 1fr)" gap={6} p={"12px"}>
                      <GridItem w="100%" h="10">
                        <Badge w={"100%"} textAlign={"center"}>
                          Table pct
                        </Badge>
                        <Badge
                          textAlign={"center"}
                          w={"100%"}
                          bg={"transparent"}
                        >
                          {diamond?.tablePct} %
                        </Badge>
                      </GridItem>
                      <GridItem w="100%" h="10">
                        <Badge w={"100%"} textAlign={"center"}>
                          depth pct
                        </Badge>
                        <Badge
                          textAlign={"center"}
                          w={"100%"}
                          bg={"transparent"}
                        >
                          {diamond?.depthPct} %
                        </Badge>
                      </GridItem>
                      <GridItem w="100%" h="10">
                        <Badge w={"100%"} textAlign={"center"}>
                          pav. depth
                        </Badge>
                        <Badge
                          textAlign={"center"}
                          w={"100%"}
                          bg={"transparent"}
                        >
                          {diamond?.pavPct} %
                        </Badge>
                      </GridItem>
                      <GridItem w="100%" h="10">
                        <Badge w={"100%"} textAlign={"center"}>
                          pav. angle
                        </Badge>
                        <Badge
                          textAlign={"center"}
                          w={"100%"}
                          bg={"transparent"}
                        >
                          {diamond?.pavAngle} °
                        </Badge>
                      </GridItem>
                      <GridItem w="100%" h="10">
                        <Badge w={"100%"} textAlign={"center"}>
                          crown h
                        </Badge>
                        <Badge
                          textAlign={"center"}
                          w={"100%"}
                          bg={"transparent"}
                        >
                          {diamond?.crownPct} %
                        </Badge>
                      </GridItem>
                    </Grid>
                    <Grid templateColumns="repeat(5, 1fr)" gap={6} p={"12px"}>
                      <GridItem w="100%" h="10">
                        <Badge w={"100%"} textAlign={"center"}>
                          crown angle
                        </Badge>
                        <Badge
                          textAlign={"center"}
                          w={"100%"}
                          bg={"transparent"}
                        >
                          {diamond?.crownAngle} °
                        </Badge>
                      </GridItem>
                      <GridItem w="100%" h="10">
                        <Badge
                          w={"99%"}
                          textAlign={"center"}
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          L. Half pct
                        </Badge>
                        <Badge
                          textAlign={"center"}
                          w={"100%"}
                          bg={"transparent"}
                        >
                          {diamond?.lowerHalfPct} %
                        </Badge>
                      </GridItem>
                      <GridItem w="100%" h="10">
                        <Badge
                          w={"99%"}
                          textAlign={"center"}
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          Star pct
                        </Badge>
                        <Badge
                          textAlign={"center"}
                          w={"100%"}
                          bg={"transparent"}
                        >
                          {diamond?.starPct} %
                        </Badge>
                      </GridItem>
                      <GridItem w="100%" h="10">
                        <Badge w={"100%"} textAlign={"center"}>
                          Gridle pct
                        </Badge>
                        <Badge
                          textAlign={"center"}
                          w={"100%"}
                          bg={"transparent"}
                        >
                          {diamond?.girdlePct} %
                        </Badge>
                      </GridItem>
                      <GridItem w="100%" h="10">
                        <Badge w={"100%"} textAlign={"center"}>
                          culet
                        </Badge>
                        <Badge
                          textAlign={"center"}
                          w={"100%"}
                          bg={"transparent"}
                        >
                          {diamond?.culet}
                        </Badge>
                      </GridItem>
                    </Grid>
                  </Box>
                  <Box w={"100%"}>
                    <Box
                      fontWeight={"bold"}
                      fontSize={"small"}
                      bg={bgColor2}
                      p={"8px 0 8px 10px"}
                      mb={"8px"}
                      color={bgColor}
                    >
                      CLARITY CHARACTERISTICS
                    </Box>
                    <Image
                      marginX={"auto"}
                      w={"200px"}
                      src="/images/clarity_charact.webp"
                    />
                    <Grid templateColumns="repeat(5, 1fr)" gap={6} p={"12px"}>
                      {diamond?.laserDrillHole && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Laser Drill Hole
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.feather && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Feather
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.crystal && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Crystal
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.chip && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Chip
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.needle && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Needle
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.cavity && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Cavity
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.pinpoint && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Pinpoint
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.bruise && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Bruise
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.cloud && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Cloud
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.etchChannel && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Etch Channel
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.twinningWisp && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Twinning Wisp
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.identedNatural && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Indented Natural
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.knot && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Knot
                          </Badge>
                        </GridItem>
                      )}
                      {diamond?.natural && (
                        <GridItem w="100%" h="10">
                          <Badge w={"100%"} textAlign={"center"}>
                            Natural
                          </Badge>
                        </GridItem>
                      )}
                    </Grid>
                  </Box>
                </VStack>
              </GridItem>
            </Grid>
          </Skeleton>
        </Container>
      </Box>
    </Box>
  );
}
