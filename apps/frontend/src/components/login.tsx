import { createRoute } from "@tanstack/react-router";
import { BaseRoute } from "./base.tsx";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <FormInput name={"Username"} value={username} setValue={setUsername} />
      <FormInput
        type={"password"}
        name={"Password"}
        value={password}
        setValue={setPassword}
      />
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
    <label>
      {name}:
      <input
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
