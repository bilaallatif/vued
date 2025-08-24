import { createRoute } from "@tanstack/react-router";
import { BaseRoute } from "./base.tsx";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      {/* Backlight */}
      {/*<div className="absolute w-full h-full -z-10 transform-gpu overflow-hidden blur-3xl scale-80">*/}
      {/*  <div*/}
      {/*    style={{*/}
      {/*      clipPath:*/}
      {/*        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",*/}
      {/*    }}*/}
      {/*    className="relative w-full h-full bg-linear-to-tr from-yellow-900 to-yellow-200 opacity-10"*/}
      {/*  />*/}
      {/*</div>*/}

      <div className={"flex flex-col gap-10 mx-auto"}>
        <div className={"flex flex-col gap-2"}>
          <FormInput
            name={"Username"}
            value={username}
            setValue={setUsername}
          />
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
    </>
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
