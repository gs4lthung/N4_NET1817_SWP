import {
  Badge,
  Button,
  Flex,
  Grid,
  GridItem,
  ListItem,
  SimpleGrid,
  Text,
  UnorderedList,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage } from "@cloudinary/react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
export default function DiamondCheckDetails() {
  const { certificateId } = useParams();
  const cld = new Cloudinary({
    cloud: {
      cloudName: "drmnbl51j",
    },
  });
  const location = useLocation();
  const bgColor = useColorModeValue("white", "black");
  const diamondId = location.state?.diamondId;
  const [diamond, setDiamond] = useState({});
  const [diamondImages, setDiamondImages] = useState([]);
  const formattedDate = new Date(diamond?.createdDate).toLocaleDateString();
  let checkId = null;
  if (diamondId === undefined) checkId = certificateId;
  else checkId = diamondId;

  const fetchValuatedDiamond = () => {
    axios
      .get(`http://diamondval-latest.onrender.com

/api/valuated-diamond/get?id=${checkId}`)
      .then(function (response) {
        // console.log(response.data);
        if (response.data === null) {
        } else {
          setDiamond(response.data);
          console.log(diamond);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fetchValuatedDiamondImages = () => {
    axios
      .get(
        `http://diamondval-latest.onrender.com

/api/valuated-diamond-image/get?diamondId=${checkId}`
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
    console.log(certificateId);
    fetchValuatedDiamond();
    fetchValuatedDiamondImages();
  }, []);
  return (
    <Flex
      direction={{ base: "column", md: "row", lg: "row" }}
      alignItems="center"
      justifyContent="center"
      height={{ base: "", md: "100vh", lg: "100vh" }}
      gap={{ base: 10, md: 15, lg: 20 }}
      p={10}
      bg={bgColor}
    >
      <SimpleGrid
        columns={{
          lg:
            (diamondImages.length === 1 && 1) ||
            (diamondImages.length === 2 && 2) ||
            Math.ceil(diamondImages.length / 2),
        }}
        spacing={10}
      >
        {diamondImages?.map((image, index) => {
          return (
            <AdvancedImage
              key={index}
              cldImg={cld
                .image(image)
                .resize(thumbnail().width(200).height(200))}
            />
          );
        })}
      </SimpleGrid>
      <Flex direction={"column"} gap={5}>
        <Flex direction={"row"} alignItems={"center"} gap={5}>
          <Text fontSize="xl" fontWeight={"bold"}>
            ID {diamond?.id}
          </Text>
          <Badge colorScheme="green">{diamond?.origin} Diamond</Badge>
        </Flex>
        <Text fontSize="sm" color={"gray"}>
          Valuated Date: {formattedDate}
        </Text>
        <UnorderedList>
          <ListItem>
            Fair Price Estimate:{" "}
            <Text display={"inline"} color={"blue.400"} fontWeight={"bold"}>
              ${diamond?.price}
            </Text>
          </ListItem>
          {/* <ListItem>
            Estimate Range:{" "}
            <Text display={"inline"} color={"blue.400"} fontWeight={"bold"}>
              $5,563 - $8,929
            </Text> 
          </ListItem> */}
        </UnorderedList>
        <Grid
          templateColumns="repeat(4, 1fr)"
          border={"2px solid"}
          borderRadius={"10px"}
          borderColor={"blue.400"}
          p={5}
          gap={5}
        >
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Price
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              ${diamond?.price || "0"}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Cut
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {diamond?.cut || "N/A"}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Origin
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {diamond?.origin || "N/A"}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Measurement
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {diamond?.measurements || "N/A"}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Shape
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {diamond?.shape || "N/A"}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Color
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {diamond?.color || "N/A"}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Fluorescence
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {diamond?.fluorescence || "N/A"}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Polish
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {diamond?.polish || "N/A"}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Carat
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {diamond?.carat_weight || "0"} ct.
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Clarity
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {diamond?.clarity || "N/A"}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Symmetry
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {diamond?.symmetry || "N/A"}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs" fontWeight={"bold"} color={"gray"}>
              Proportions
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {diamond?.proportions || "N/A"}
            </Text>
          </GridItem>
        </Grid>
        <Button colorScheme="blue" size={{ base: "sm", md: "md", lg: "lg" }}>
          Run another check
        </Button>
      </Flex>
    </Flex>
  );
}
