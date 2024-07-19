import React from "react";
import { Button, Flex, IconButton } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
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
          colorScheme="blue"
          variant={"outline"}
          border={"none"}
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
