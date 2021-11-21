import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import signInFormStore from "../../stores/sign_in/sign_in_form_store";
import Router from "next/router";
import { useToast } from "@chakra-ui/toast";
import { db } from "../../configurations/firestore_config";
import { useEffect } from "react";
import { collection, getDocs } from "@firebase/firestore";

const SignInForm = () => {
  const TOAST = useToast();

  const EMAIL = signInFormStore((state) => state.email);
  const PASSWORD = signInFormStore((state) => state.password);

  const SET_email = signInFormStore((state) => state.set_email);
  const SET_PASSWORD = signInFormStore((state) => state.set_password);

  const SET_IS_AUTHENTICATING = signInFormStore(
    (state) => state.set_is_authenticating
  );

  const SET_IS_SIGNED_IN = signInFormStore((state) => state.set_is_signed_in);

  const ACCOUNTS_COLLECTION_REF = collection(db, "admin_accounts");

  function successfullAuth() {
    Router.push("/dashboard").then(() => {
      TOAST({
        status: "success",
        title: "Sign in success",
        description: "Redirecting to dashboard.",
        duration: 3000,
      });
      SET_IS_AUTHENTICATING({ is_authenticating: false });
      SET_IS_SIGNED_IN({ is_signed_in: true });
      localStorage.setItem("is_signed_in", "true");
    });
  }

  function failedAuth() {
    TOAST({
      status: "error",
      title: "Sign in failed",
      description: "Credentials does not match our records.",
      duration: 2000,
    });
    SET_IS_AUTHENTICATING({ is_authenticating: false });
  }

  function validateCredentials({ email, password }) {
    PASSWORD == password && EMAIL == email ? successfullAuth() : failedAuth();
  }

  const authenticate = async () => {
    SET_IS_AUTHENTICATING({ is_authenticating: true });

    const data = await getDocs(ACCOUNTS_COLLECTION_REF);
    data.docs.map((doc) => {
      doc.exists
        ? doc.id.includes(EMAIL)
          ? validateCredentials({
              email: doc.data().email,
              password: doc.data().password,
            })
          : failedAuth()
        : failedAuth();
    });
  };

  return (
    <>
      <Input
        placeholder="Account ID"
        onChange={(value) =>
          SET_email({ email: value.target.value.toString() })
        }
      />

      <Input
        placeholder="Password"
        type="PASSWORD"
        onChange={(value) =>
          SET_PASSWORD({ password: value.target.value.toString() })
        }
      />

      <Button width="100%" onClick={authenticate}>
        SUBMIT
      </Button>
    </>
  );
};

export default SignInForm;
