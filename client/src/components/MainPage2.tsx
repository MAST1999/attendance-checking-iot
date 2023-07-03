import {useQuery} from "@tanstack/react-query"
import React, { useState } from "react"

export default function MainPage(): JSX.Element {

  function handleAuth(): JSX.Element {

  
    if (isLoading) {
      return <span>Loading...</span>
    }
  
    if (isError) {
      return <span>Error: {error.message}</span>
    }
  
    // We can assume by this point that `isSuccess === true`
    return (
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    )
  }


  const [userPass, SetUserPass] = useState<{username: string, password: string}>({username: "", password: ""});

  const handleUser = (e: React.ChangeEvent) => {
    const target = e.target as HTMLButtonElement;
    SetUserPass({...userPass, username: target.value})
  }

  const hand
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
            onChange={handlePass}
            required
          />
          <input
            type="password"
            placeholder="Admin password"
            className="mt-3 h-10 p-3 rounded-md"
            onChange={handleUser}
            required
          />
          <button 
            className="loginBtn"
            onClick={handleAuth}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
