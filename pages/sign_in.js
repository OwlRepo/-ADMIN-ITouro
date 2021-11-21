import { Box, Center, Flex, VStack } from "@chakra-ui/layout";
import useWindowSize from "../hooks/useWindowSize";
import { Headers, ForgotPassword, SignInForm } from "../components/sign_in";
import { FadingCircle } from "better-react-spinkit";
import signInFormStore from "../stores/sign_in/sign_in_form_store";
import Router from "next/router";

import { useEffect } from "react";

export default function SignIn() {
  const { height, width } = useWindowSize();
  const is_authenticating = signInFormStore((state) => state.is_authenticating);

  useEffect(() => {
    const { pathname } = Router;
    const is_signed_in = localStorage.getItem("is_signed_in");
    console.log("is_signed_in: " + is_signed_in);

    if (is_signed_in == undefined) {
      Router.push("/sign_in").then(() =>
        localStorage.setItem("is_signed_in", "false")
      );
    } else if (is_signed_in == "true" && pathname == "/sign_in") {
      Router.push("/dashboard");
    }
  });

  return (
    <Flex
      flex={1}
      flexDirection="column"
      justifyContent="center"
      alignItems={is_authenticating ? "center" : "flex-start"}
      height={height}
      minHeight={height * 0.5}
      width={width}
      minWidth="768px"
      backgroundColor="#f3f6f4"
    >
      {is_authenticating ? (
        <FadingCircle size={50} />
      ) : (
        <VStack
          minWidth="30%"
          alignSelf="center"
          backgroundColor="white"
          shadow={"lg"}
          padding={10}
          borderRadius="md"
        >
          {Headers}
          <Box height={5} />
          <SignInForm />
          <Box height={1} />
          {ForgotPassword}
        </VStack>
      )}
    </Flex>
  );
}
