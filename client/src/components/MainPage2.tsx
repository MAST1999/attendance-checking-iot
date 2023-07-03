import React, { useState } from "react";
import { useAuthentication } from "./useAuth";

export default function MainPage(): JSX.Element {
  const [userPass, setUserPass] = useState({ username: "", password: "" });

  const handleUser = (e: React.ChangeEvent) => {
    const target = e.target as HTMLButtonElement;
    setUserPass({ ...userPass, username: target.value });
  };

  const handlePass = (e: React.ChangeEvent) => {
    const target = e.target as HTMLButtonElement;
    setUserPass({ ...userPass, password: target.value });
  };

  const authMutation = useAuthentication();

  return (
    <div className="grid grid-rows-1 grid-cols-1 w-[100%] h-[100%] overflow-hidden md:grid-cols-2">
      <div className="hidden bg-bg-main bg-no-repeat bg-cover bg-black md:block" />
      <div className="m-auto">
        <p className="font-mono text-xl">
          Enter Admin username and password below
        </p>
        <div className="flex flex-col w-[100%] justify-center items-center font-mono">
          <input
            type="text"
            placeholder="Admin username"
            className="mt-3 h-10 p-3 rounded-md"
            onChange={handleUser}
            required
          />
          <input
            type="password"
            placeholder="Admin password"
            className="mt-3 h-10 p-3 rounded-md"
            onChange={handlePass}
            required
          />
          <button
            className="loginBtn"
            onClick={() => {
              console.log("hello");
              authMutation.mutate({
                password: userPass.password,
                personnelId: userPass.username,
              });
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
