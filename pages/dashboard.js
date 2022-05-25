import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/layout";
import useWindowSize from "../hooks/useWindowSize";
import React, { useState } from "react";
import Router from "next/router";
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/table";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "@firebase/firestore";
import { db } from "../configurations/firestore_config";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IconButton } from "@chakra-ui/button";
import { Tooltip } from "@chakra-ui/tooltip";

export default function Dashboard(props) {
  const { height, width } = useWindowSize();
  const [fareCategory, setFareCategory] = useState("");
  const [fareTravelType, setFareTravelType] = useState("");

  const updateFarePrice = async ({ route, travel_type, amount }) => {
    // const FARE_MATRIX_COLLECTIONS_REF = doc(
    //   db,
    //   "fare_matrix",
    //   route,
    //   "fare",
    //   travel_type
    // );
    // await updateDoc(FARE_MATRIX_COLLECTIONS_REF, {
    //   price: 99,
    // });
  };

  return (
    <Flex
      flex={1}
      padding={5}
      flexDirection="column"
      height={height}
      minHeight={height * 0.5}
      width={width}
      backgroundColor="#f3f6f4"
    >
      <HStack justifyContent={"space-between"}>
        <VStack alignItems="flex-start">
          <Heading>Dashboard</Heading>
          <Text fontSize="md">Your quick access to all operations</Text>
        </VStack>
        <HStack alignItems={"center"}>
          <Tooltip label="Sign out">
            <VStack
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                Router.push("/sign_in").then(() =>
                  localStorage.setItem("is_signed_in", "false")
                );
              }}
            >
              <IconButton
                icon={<RiLogoutBoxLine color="white" />}
                backgroundColor="#444444"
                onClick={() => {
                  Router.push("/sign_in").then(() =>
                    localStorage.setItem("is_signed_in", "false")
                  );
                }}
              />
              <Text fontSize="md">Sign out</Text>
            </VStack>
          </Tooltip>
          <Box width={"2vw"} />
          <VStack alignItems={"flex-end"}>
            <Text>Mother Wallet Balance</Text>
            <Heading>{`₱ ${props.mother_wallet_credits}`}</Heading>
          </VStack>
        </HStack>
      </HStack>
      <Box height={5} />
      <Text fontSize="3xl">Routes</Text>
      <Flex
        padding={2}
        spacing={5}
        overflow={width <= 520 ? "scroll" : "hidden"}
      >
        {props.routes.map((data, index) => {
          return (
            <Box
              key={index}
              backgroundColor="white"
              minWidth={220}
              height={100}
              padding={5}
              borderRadius={"md"}
              shadow="md"
              _hover={{
                cursor: "pointer",
              }}
              marginRight={5}
              marginBottom={5}
            >
              <Text fontSize="xl" fontWeight="bold">
                {data.id}
              </Text>
              <Text fontSize="md">{data.name}</Text>
            </Box>
          );
        })}
        {/* <Box
          backgroundColor="white"
          minWidth={220}
          height={100}
          padding={5}
          borderRadius={"md"}
          shadow="md"
          _hover={{
            cursor: "pointer",
          }}
        >
          <VStack height="100%" justifyContent="center" alignItems="center">
            <AddIcon />
            <Text fontSize="sm">Tap here to add new route</Text>
          </VStack>
        </Box> */}
      </Flex>
      <Box height={3} />
      <Divider width="95%" alignSelf="center" />
      <Box height={5} />
      <Text fontSize="3xl">Fare Matrix</Text>
      <HStack padding={2} overflow={width <= 520 ? "scroll" : "hidden"}>
        <Table
          variant="striped"
          backgroundColor="white"
          borderRadius="lg"
          colorScheme="gray"
          shadow="lg"
        >
          <TableCaption>
            This is the official fare matrix for E-Jeep based on LTO.
          </TableCaption>
          <Thead>
            <Tr>
              <Th>ROUTE NAME</Th>
              <Th>TRAVEL TYPE</Th>
              <Th>PRICE</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.fare.map((data, index) => {
              return (
                <Tr key={index}>
                  <Td>{data.name}</Td>
                  <Td>{data.travel_type}</Td>
                  <Td>{`Php ` + data.price.toFixed(2)}</Td>
                  {/* <Td isNumeric>
                    <HStack justifyContent="flex-end">
                      <Tooltip label="Edit">
                        <IconButton
                          icon={<EditIcon color="white" />}
                          backgroundColor="#444444"
                          onClick={() => {
                            setFareCategory(data.route);
                            setFareTravelType(data.id);
                            updateFarePrice({
                              route: data.route,
                              travel_type: data.id,
                            });
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete">
                        <IconButton
                          icon={<DeleteIcon color="white" />}
                          backgroundColor="#ff5151"
                        />
                      </Tooltip>
                    </HStack>
                  </Td> */}
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>ROUTE NAME</Th>
              <Th>TRAVEL TYPE</Th>
              <Th>PRICE</Th>
            </Tr>
          </Tfoot>
        </Table>
      </HStack>
    </Flex>
  );
}

export async function getServerSideProps(context) {
  //ROUTES
  const ROUTES_COLLECTIONS_REF = collection(db, "routes");
  var ROUTES = [];

  const DB_ROUTES_DATA = await getDocs(ROUTES_COLLECTIONS_REF);
  ROUTES = DB_ROUTES_DATA.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  var fetchFareMatrix = ROUTES.map(async (data, index) => {
    const FARE_MATRIX_COLLECTIONS_REF = collection(
      db,
      "fare_matrix",
      data.id,
      "fare"
    );
    const DB_FARE_MATRIX_DATA = await getDocs(FARE_MATRIX_COLLECTIONS_REF);
    const FARE_LIST = [];

    DB_FARE_MATRIX_DATA.forEach((doc) => {
      const id = doc.id;
      const name = doc.data().name;
      const travel_type = doc.data().travel_type;
      const price = doc.data().price;
      const route = doc.data().route;

      const fare_data = {
        price: price,
        name: name,
        travel_type: travel_type,
        id: id,
        route: route,
      };

      FARE_LIST.push(fare_data);
    });

    return FARE_LIST;
  });

  const FARE_MATRIX = await Promise.all(fetchFareMatrix).then((fareMatrix) =>
    fareMatrix.flat()
  );

  const MOTHER_WALLET_DOC_REF = doc(db, "wallets", "mother_wallet");
  const docSnap = await getDoc(MOTHER_WALLET_DOC_REF);
  const MOTHER_WALLET_CREDITS = docSnap.data().credits;

  return {
    props: {
      routes: ROUTES,
      fare: FARE_MATRIX,
      mother_wallet_credits: MOTHER_WALLET_CREDITS,
    },
  };
}
