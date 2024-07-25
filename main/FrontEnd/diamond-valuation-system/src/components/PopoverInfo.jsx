import {
  Flex,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
export default function PopoverInfo({ content, header, body, align }) {
  return (
    <Popover>
      <PopoverTrigger>
        <Flex direction={"column"} alignItems={align}>
          <Flex direction={"row"} gap={2}>
            <Text
              fontSize={{ base: "sm", md: "md", lg: "md" }}
              color={"black"}
              fontWeight={"bold"}
            >
              {header}
            </Text>
            <InfoOutlineIcon boxSize={3} />
          </Flex>
          <Text
            fontSize={{ base: "sm", md: "md", lg: "md" }}
            fontWeight={"bold"}
          >
            {content}
          </Text>
        </Flex>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <Text>{header}</Text>
        </PopoverHeader>
        <PopoverBody>{body}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
