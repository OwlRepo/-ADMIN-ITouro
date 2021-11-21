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
import React from "react";
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
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../configurations/firestore_config";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Button, IconButton } from "@chakra-ui/button";
import { Tooltip } from "@chakra-ui/tooltip";

export default function Dashboard(props) {
  const { height, width } = useWindowSize();
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
      <HStack>
        <VStack alignItems="flex-start">
          <Heading>Dashboard</Heading>
          <Text fontSize="md">Your quick access to all operations</Text>
        </VStack>
        <Spacer />
        <HStack>
          <Tooltip label="Sign out">
            <IconButton
              icon={<RiLogoutBoxLine color="white" />}
              backgroundColor="#444444"
              onClick={() => Router.push("/sign_in")}
            />
          </Tooltip>
        </HStack>
      </HStack>
      <Box height={5} />
      <Text fontSize="3xl">Routes</Text>
      <Flex padding={2} spacing={5} wrap="wrap" minWidth="80%">
        {props.routes.map((data, index) => {
          return (
            <Box
              key={index}
              backgroundColor="white"
              width={220}
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
        <Box
          backgroundColor="white"
          width={220}
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
        </Box>
      </Flex>
      <Box height={3} />
      <Divider width="95%" alignSelf="center" />
      <Box height={5} />
      <HStack paddingRight={4} justifyContent="space-between">
        <Text fontSize="3xl">Fare Matrix</Text>
        <Button color="white" backgroundColor="black">
          + Add new fare
        </Button>
      </HStack>
      <HStack padding={2}>
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
              <Th isNumeric>ACTIONS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.fare.map((data, index) => {
              return (
                <Tr key={index}>
                  <Td>{data.name}</Td>
                  <Td>{data.travel_type}</Td>
                  <Td>{`Php ` + data.price}</Td>
                  <Td isNumeric>
                    <HStack justifyContent="flex-end">
                      <Tooltip label="Edit">
                        <IconButton
                          icon={<EditIcon color="white" />}
                          backgroundColor="#444444"
                          onClick={() => {
                            console.log(data.id);
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
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>ROUTE NAME</Th>
              <Th>TRAVEL TYPE</Th>
              <Th>PRICE</Th>
              <Th isNumeric>ACTIONS</Th>
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

  //FARE MATRIX
  const FARE_MATRIX_COLLECTIONS_REF = collection(
    db,
    "fare_matrix",
    "ROUTE 1",
    "fare"
  );
  var FARE_MATRIX = [];
  const DB_FARE_MATRIX_DATA = await getDocs(FARE_MATRIX_COLLECTIONS_REF);
  FARE_MATRIX = DB_FARE_MATRIX_DATA.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return {
    props: {
      routes: ROUTES,
      fare: FARE_MATRIX,
    },
  };
}