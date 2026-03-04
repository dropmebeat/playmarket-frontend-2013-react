import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { GlobalStyles } from "./styles/GlobalStyles";
import { ThemeProvider } from "./theme/theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        lazy: async () => {
          const module = await import("./pages/StorePage");
          return { Component: module.StorePage };
        },
      },
      {
        path: "store",
        lazy: async () => {
          const module = await import("./pages/StorePage");
          return { Component: module.StorePage };
        },
      },
      {
        path: "store/apps",
        lazy: async () => {
          const module = await import("./pages/StoreAppsPage");
          return { Component: module.StoreAppsPage };
        },
      },
      {
        path: "store/games",
        lazy: async () => {
          const module = await import("./pages/StoreGamesPage");
          return { Component: module.StoreGamesPage };
        },
      },
      {
        path: "store/movies",
        lazy: async () => {
          const module = await import("./pages/StoreMoviesPage");
          return { Component: module.StoreMoviesPage };
        },
      },
      {
        path: "movies",
        lazy: async () => {
          const module = await import("./pages/StoreMoviesPage");
          return { Component: module.StoreMoviesPage };
        },
      },
      {
        path: "movies/popular",
        lazy: async () => {
          const module = await import("./pages/StoreMoviesListPages");
          return { Component: module.StoreMoviesPopularPage };
        },
      },
      {
        path: "movies/new",
        lazy: async () => {
          const module = await import("./pages/StoreMoviesListPages");
          return { Component: module.StoreMoviesNewPage };
        },
      },
      {
        path: "movie/:id",
        lazy: async () => {
          const module = await import("./pages/MovieDetailsPage");
          return { Component: module.MovieDetailsPage };
        },
      },
      {
        path: "auth",
        lazy: async () => {
          const module = await import("./pages/AuthPage");
          return { Component: module.AuthPage };
        },
      },
      {
        path: "register",
        lazy: async () => {
          const module = await import("./pages/RegisterPage");
          return { Component: module.RegisterPage };
        },
      },
      {
        path: "user",
        lazy: async () => {
          const module = await import("./pages/UserPage");
          return { Component: module.UserPage };
        },
      },
      {
        path: "app/id",
        lazy: async () => {
          const module = await import("./pages/AppDetailsPage");
          return { Component: module.AppDetailsPage };
        },
      },
      {
        path: "app/:id",
        lazy: async () => {
          const module = await import("./pages/AppDetailsPage");
          return { Component: module.AppDetailsPage };
        },
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <GlobalStyles />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
