import { IconButton, useColorMode, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
export default function DarkModeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  const onToggle = useDisclosure();
  const changeColorMode = () => {
    toggleColorMode();
};
  return (
    <IconButton
      size={{ base: "xs", md: "sm", lg: "md" }}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      onClick={changeColorMode}
    />
  );
}
