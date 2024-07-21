import React from "react";
import { Button, Flex, IconButton } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
export default function PageIndicator({
  totalPages,
  currentPage,
  setCurrentPage,
}) {
  const pageIndicator = [];
  if (totalPages !== null) {
    for (let i = 1; i <= totalPages; i++) {
      pageIndicator.push(
        <Button
          key={i}
          as={motion.div}
          whileHover={{ scale: 1.2 }}
          transition="0.1s linear"
          colorScheme="blue"
          variant={"outline"}
          border={"none"}
          bg={currentPage === i ? "blue.100" : "transparent"}
          onClick={() => {
            setCurrentPage(i);
          }}
        >
          {i}
        </Button>
      );
    }
  }
  return (
    <>
      <Flex gap={5}>
        <IconButton
          icon={<ChevronLeftIcon />}
          colorScheme="blue"
          variant={"outline"}
          border={"none"}
          as={motion.div}
          whileHover={{ scale: 1.2 }}
          transition="0.1s linear"
          onClick={() => {
            if (totalPages > 1 && currentPage > 1) {
              setCurrentPage((pre) => pre - 1);
            }
          }}
        />
        {pageIndicator}
        <IconButton
          icon={<ChevronRightIcon />}
          colorScheme="blue"
          variant={"outline"}
          border={"none"}
          as={motion.div}
          whileHover={{ scale: 1.2 }}
          transition="0.1s linear"
          onClick={() => {
            if (totalPages > 1 && currentPage < totalPages) {
              setCurrentPage((pre) => pre + 1);
            }
          }}
        />
      </Flex>
    </>
  );
}
