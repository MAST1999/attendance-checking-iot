import React, { useState } from "react";
import { useAuthentication } from "./useAuth";
import { useNavigate } from "react-router-dom";

export default function MainPage(): JSX.Element {
  const [userPass, setUserPass] = useState({ username: "", password: "" });
  const homePage = useNavigate()

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
        <div className="flex flex-col w-[100%] justify-center items-center font-mono">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Username:</span>
            </label>
            <input
              type="text"
              placeholder="Admin username"
              className="input input-bordered input-primary w-full max-w-xs"
              onChange={handleUser}
              required
            />
          </div>
            <div className="form-control w-full max-w-xs">
            <label className="label mt-3">
              <span className="label-text">Password:</span>
            </label>
            <input
              type="password"
              placeholder="Admin password"
              className="input input-bordered input-primary w-full max-w-xs"
              onChange={handlePass}
              required
            />
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={() => {
              authMutation.mutate({
                password: userPass.password,
                personnelId: userPass.username,
              });
              if(authMutation.isSuccess){
                setTimeout(() => {
                  homePage('/home', { replace: true });
                }, 3000);
              }
            }}
            disabled={authMutation.isLoading}
          >
            Login
          </button>
          {authMutation.isSuccess && (
            <>
              <p className="mt-3">welcome {authMutation.data.firstname}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
