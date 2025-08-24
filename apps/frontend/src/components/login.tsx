import { createRoute } from "@tanstack/react-router";
import { BaseRoute } from "./base.tsx";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={"flex flex-col gap-10"}>
      <div className={"flex flex-col gap-2"}>
        <FormInput name={"Username"} value={username} setValue={setUsername} />
        <FormInput
          type={"password"}
          name={"Password"}
          value={password}
          setValue={setPassword}
        />
      </div>
      <button
        className={
          "text-neutral-900 text-2xl bg-yellow-600 p-2 rounded-md hover:bg-yellow-500 hover:scale-110 transition-transform duration-200"
        }
      >
        Log In
      </button>
    </div>
  );
};

export interface FormInputProps {
  type?: string;
  name: string;
  value: string;
  setValue: (value: string) => void;
}

const FormInput = ({
  type = "text",
  name,
  value,
  setValue,
}: FormInputProps) => {
  return (
    <label className={"text-2xl text-neutral-400 flex flex-col gap-2"}>
      {name}
      <input
        className={
          "block bg-neutral-100/5 rounded-md focus:outline-2 focus:outline-yellow-600 px-2"
        }
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
};

export const LoginRoute = createRoute({
  getParentRoute: () => BaseRoute,
  path: "login",
  component: Login,
});
