import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { GlobalStyles } from "./styles/GlobalStyles";
import { AppDetailsPage } from "./pages/AppDetailsPage";
import { StoreAppsPage } from "./pages/StoreAppsPage";
import { StorePage } from "./pages/StorePage";
import { AuthPage } from "./pages/AuthPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <StorePage /> },
      { path: "store", element: <StorePage /> },
      { path: "store/apps", element: <StoreAppsPage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "app/id", element: <AppDetailsPage /> },
      { path: "app/:id", element: <AppDetailsPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyles />
    <RouterProvider router={router} />
  </StrictMode>,
);