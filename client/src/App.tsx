import './App.css'
import MainPage from './components/MainPage'
import MainPage2 from './components/MainPage2'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <MainPage />,
  },
  {
    path: "/",
    element: <MainPage2 />,
  },
]);

function App() {
  return(
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

