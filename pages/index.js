import { Flex } from "@chakra-ui/layout";
import useWindowSize from "../hooks/useWindowSize";
import { FadingCircle } from "better-react-spinkit";
import React, { useEffect } from "react";
import Router from "next/router";

export default function Home() {
  const { height, width } = useWindowSize();
  useEffect(() => {
    const { pathname } = Router;
    setTimeout(() => {
      if (pathname == "/") {
        Router.push("/sign_in");
      }
    }, [2000]);
  });

  return (
    <Flex
      flex={1}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={height}
      minHeight={height * 0.5}
      width={width}
      minWidth="768px"
      backgroundColor="#f3f6f4"
    >
      <FadingCircle size={100} />
    </Flex>
  );
}
