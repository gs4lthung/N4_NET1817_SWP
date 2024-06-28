import {
  Avatar,
  Box,
  Flex,
  StackDivider,
  Text,
  VStack,
  WrapItem,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  IoHomeOutline,
  IoNewspaperOutline,
  IoDiamondSharp,
} from "react-icons/io5";
import { IoIosNotificationsOutline, IoMdSearch, IoMdAdd } from "react-icons/io";
import { CiCalendar, CiBellOn, CiSettings } from "react-icons/ci";
import { PiCalculatorThin } from "react-icons/pi";
import { VscServerProcess } from "react-icons/vsc";
import { BsNewspaper } from "react-icons/bs";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { Link } from "react-router-dom";
import routes from "../../config/Config";
import { UserContext } from "../../components/GlobalContext/AuthContext";
import Profile from "../../components/Profile";
export default function SideBar() {
  const auth = useContext(UserContext);
  console.log(auth);
  return (
    <div>
      <Box>
        <Profile />
        <VStack
          py={5}
          pl={3}
          divider={<StackDivider borderColor={"rgb(243 244 246)"} />}
          spacing={0}
          align="stretch"
          bg={"rgb(243 244 246)"}
        >
          <Link to={routes.dashboard}>
            <Flex
              pl={2}
              _hover={{
                background: "rgb(55 65 81)",
                color: "#fff",
              }}
              cursor="pointer"
              borderRadius={3}
              alignItems={"center"}
              h="40px"
              color={"#000"}
            >
              <RxDashboard />
              <Text ml={3}>Dashboard</Text>
            </Flex>
          </Link>
          {(auth.userAuth.roleid === 3 ||
            auth.userAuth.roleid === 4 ||
            auth.userAuth.roleid === 5) && (
            <Link to={routes.dasboardNotification}>
              <Flex
                pl={2}
                _hover={{
                  background: "rgb(55 65 81)",
                  color: "#fff",
                }}
                cursor="pointer"
                borderRadius={3}
                alignItems={"center"}
                h="40px"
                color={"#000"}
              >
                <IoIosNotificationsOutline />
                <Text ml={3}>Notifications</Text>
              </Flex>
            </Link>
          )}
          {auth.userAuth.roleid === 5 && (
            <Link to={routes.dashboardAppoint}>
              <Flex
                pl={2}
                _hover={{
                  background: "rgb(55 65 81)",
                  color: "#fff",
                }}
                cursor="pointer"
                borderRadius={3}
                alignItems={"center"}
                h="40px"
                color={"#000"}
              >
                <CiCalendar />
                <Text ml={3}>Appointments</Text>
              </Flex>
            </Link>
          )}
          {auth.userAuth.roleid === 2 && (
            <>
              <Link to={"#"}>
                <Flex
                  pl={2}
                  _hover={{
                    background: "rgb(55 65 81)",
                    color: "#fff",
                  }}
                  cursor="pointer"
                  borderRadius={3}
                  alignItems={"center"}
                  h="40px"
                  color={"#000"}
                >
                  <IoNewspaperOutline />
                  <Text ml={3}>Sealling Letter</Text>
                </Flex>
              </Link>
              <Link to={"#"}>
                <Flex
                  pl={2}
                  _hover={{
                    background: "rgb(55 65 81)",
                    color: "#fff",
                  }}
                  cursor="pointer"
                  borderRadius={3}
                  alignItems={"center"}
                  h="40px"
                  color={"#000"}
                >
                  <IoDiamondSharp />
                  <Text ml={3}>Valuated Diamond</Text>
                </Flex>
              </Link>
            </>
          )}
          {auth.userAuth.roleid === 3 && (
            <>
              <Link to={"#"}>
                <Flex
                  pl={2}
                  _hover={{
                    background: "rgb(55 65 81)",
                    color: "#fff",
                  }}
                  cursor="pointer"
                  borderRadius={3}
                  alignItems={"center"}
                  h="40px"
                  color={"#000"}
                >
                  <IoNewspaperOutline />
                  <Text ml={3}>Pending Request</Text>
                </Flex>
              </Link>
              <Link to={"#"}>
                <Flex
                  pl={2}
                  _hover={{
                    background: "rgb(55 65 81)",
                    color: "#fff",
                  }}
                  cursor="pointer"
                  borderRadius={3}
                  alignItems={"center"}
                  h="40px"
                  color={"#000"}
                >
                  <VscServerProcess />
                  <Text ml={3}>Process Request</Text>
                </Flex>
              </Link>
            </>
          )}
          {auth.userAuth.roleid === 4 && (
            <Link to={"#"}>
              <Flex
                pl={2}
                _hover={{
                  background: "rgb(55 65 81)",
                  color: "#fff",
                }}
                cursor="pointer"
                borderRadius={3}
                alignItems={"center"}
                h="40px"
                color={"#000"}
              >
                <BsNewspaper />
                <Text ml={3}>Valuation Diamond</Text>
              </Flex>
            </Link>
          )}
        </VStack>
        <Box borderTop={"2px solid #000"}>
          <VStack
            pt={5}
            pl={3}
            divider={<StackDivider borderColor={"rgb(243 244 246)"} />}
            spacing={0}
            align="stretch"
            bg={"rgb(243 244 246)"}
            borderTopColor={"#000"}
          >
            <Link to={"/"}>
              <Flex
                pl={2}
                _hover={{
                  background: "rgb(55 65 81)",
                  color: "#fff",
                }}
                cursor="pointer"
                borderRadius={3}
                alignItems={"center"}
                h="40px"
                color={"#000"}
              >
                <IoHomeOutline />
                <Text ml={3}>Home</Text>
              </Flex>
            </Link>
            <Link to={routes.diamondCalculate}>
              <Flex
                pl={2}
                _hover={{
                  background: "rgb(55 65 81)",
                  color: "#fff",
                }}
                cursor="pointer"
                borderRadius={3}
                alignItems={"center"}
                h="40px"
                color={"#000"}
              >
                <PiCalculatorThin />
                <Text ml={3}>Valuation</Text>
              </Flex>
            </Link>
            <Link to={routes.search}>
              <Flex
                pl={2}
                _hover={{
                  background: "rgb(55 65 81)",
                  color: "#fff",
                }}
                cursor="pointer"
                borderRadius={3}
                alignItems={"center"}
                h="40px"
                color={"#000"}
              >
                <IoMdSearch />
                <Text ml={3}>Search</Text>
              </Flex>
            </Link>
            <Link to={routes.diamondCheck}>
              <Flex
                pl={2}
                _hover={{
                  background: "rgb(55 65 81)",
                  color: "#fff",
                }}
                cursor="pointer"
                borderRadius={3}
                alignItems={"center"}
                h="40px"
                color={"#000"}
              >
                <MdOutlineRemoveRedEye />
                <Text ml={3}>Diamond Check</Text>
              </Flex>
            </Link>
            {auth.userAuth.roleid === 5 && (
              <Link to={routes.dashboardSetting}>
                <Flex
                  pl={2}
                  _hover={{
                    background: "rgb(55 65 81)",
                    color: "#fff",
                  }}
                  cursor="pointer"
                  borderRadius={3}
                  alignItems={"center"}
                  h="40px"
                  color={"#000"}
                >
                  <CiSettings />
                  <Text ml={3}>Setting</Text>
                </Flex>
              </Link>
            )}
          </VStack>
        </Box>
      </Box>
    </div>
  );
}
