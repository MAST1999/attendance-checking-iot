export default function MainPage(): JSX.Element {
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
          />
          <input
            type="password"
            placeholder="Admin password"
            className="mt-3 h-10 p-3 rounded-md"
          />
          <button className="loginBtn">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
