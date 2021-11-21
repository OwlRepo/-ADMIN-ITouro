import { Flex } from "@chakra-ui/layout";
import useWindowSize from "../hooks/useWindowSize";
import { FadingCircle } from "better-react-spinkit";
import React, { useEffect } from "react";
import Router from "next/router";

export default function Home() {
  const { height, width } = useWindowSize();
  useEffect(() => {
    const { pathname } = Router;
    const is_signed_in = localStorage.getItem("is_signed_in");
    console.log("is_signed_in: " + is_signed_in);

    if (is_signed_in == undefined) {
      Router.push("/sign_in").then(() =>
        localStorage.setItem("is_signed_in", "false")
      );
    } else if (is_signed_in == "true" && pathname == "/") {
      Router.push("/dashboard");
    } else if (is_signed_in == "false" && pathname == "/") {
      Router.push("/sign_in");
    }
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
