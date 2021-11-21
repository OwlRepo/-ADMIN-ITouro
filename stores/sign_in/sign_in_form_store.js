import create from "zustand";

const signInFormStore = create((set) => ({
  email: "ss",
  password: "",

  is_signed_in: false,
  is_authenticating: false,

  set_email: ({ email }) => set(() => ({ email: email })),

  set_password: ({ password }) => set(() => ({ password: password })),

  set_is_authenticating: ({ is_authenticating }) =>
    set(() => ({
      is_authenticating: is_authenticating,
    })),
  set_is_signed_in: ({ is_signed_in }) =>
    set(() => ({
      is_signed_in: is_signed_in,
    })),
}));

export default signInFormStore;
