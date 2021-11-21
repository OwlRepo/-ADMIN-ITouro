import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import { Flex, Text } from "@chakra-ui/layout";
import useWindowSize from "../hooks/useWindowSize";
import signInFormStore from "../stores/sign_in/sign_in_form_store";

function MyApp({ Component, pageProps }) {
  const { height, width } = useWindowSize();
  const IS_SIGNED_IN = signInFormStore((state) => state.is_signed_in);
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
