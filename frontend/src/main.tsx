import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Room from "./pages/room.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import Layout from "./Layout.tsx";
import Temp from "./components/Temp.tsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "room/:slug",
        element: <Room />,
      },
      {
        path:"temp",
        element:<Temp />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <RouterProvider router={router} />
  </ThemeProvider>
);
