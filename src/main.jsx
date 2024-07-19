import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import Login from "./pages/Login.jsx";
import CreateProject from "./pages/project/CreateProject.jsx";
import EditProject from "./pages/project/EditProject.jsx";
import ProjectsList from "./pages/project/ProjectsList.jsx";
import CreateProjectItem from "./pages/project/item/CreateProjectItem.jsx";
import EditProjectItem from "./pages/project/item/EditProjectItem.jsx";
import EditProjectWorker from "./pages/project/worker/EditProjectWorker.jsx";
import NotFound from "./pages/NotFound.jsx";
import CreateProjectWorker from "./pages/project/worker/CreateProjectWorker.jsx";
import View from "./pages/project/ViewProject.jsx";
import ItemsList from "./pages/project/item/ItemsList.jsx";
import WorkersList from "./pages/project/worker/WorkersList.jsx";
import Company_expensesList from "./pages/expenses/company/ExpensesList.jsx";
import CreateExpense from "./pages/expenses/company/CreateExpense.jsx";
import EditExpense from "./pages/expenses/company/EditExpense.jsx";
import CreateLafargeExpense from "./pages/expenses/lafarge/CreateExpense.jsx";
import EditLafargeExpense from "./pages/expenses/lafarge/EditExpense.jsx";
import Lafarge_expensesList from "./pages/expenses/lafarge/ExpensesList.jsx";
import CreatePPEExpense from "./pages/expenses/ppe/CreateExpense.jsx";
import EditPPEExpense from "./pages/expenses/ppe/EditExpense.jsx";
import PPE_expensesList from "./pages/expenses/ppe/ExpensesList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/projects",
        element: <ProjectsList />,
      },
      {
        path: "/projects/create",
        element: <CreateProject />,
      },
      {
        path: "/projects/:id/edit",
        element: <EditProject />,
      },
      {
        path: "/projects/:id",
        element: <View />,
        children: [
          {
            path: "items",
            element: <ItemsList />,
          },
          {
            path: "workers",
            element: <WorkersList />,
          },
        ],
      },
      {
        path: "/projects/:id/items",
        element: <ProjectsList />,
      },
      {
        path: "/projects/:id/items/create",
        element: <CreateProjectItem />,
      },
      {
        path: "/projects/:projectId/items/:itemId/edit",
        element: <EditProjectItem />,
      },
      {
        path: "/projects/:id/workers",
        element: <ProjectsList />,
      },
      {
        path: "/projects/:id/workers/create",
        element: <CreateProjectWorker />,
      },
      {
        path: "/projects/:projectId/workers/:workerId/edit",
        element: <EditProjectWorker />,
      },
      {
        path: "/expenses/company",
        element: <Company_expensesList />,
      },
      {
        path: "/expenses/company/create",
        element: <CreateExpense />,
      },
      {
        path: "/expenses/company/:id/edit",
        element: <EditExpense />,
      },
      {
        path: "/expenses/lafarge",
        element: <Lafarge_expensesList />,
      },
      {
        path: "/expenses/lafarge/create",
        element: <CreateLafargeExpense />,
      },
      {
        path: "/expenses/lafarge/:id/edit",
        element: <EditLafargeExpense />,
      },
      {
        path: "/expenses/ppe",
        element: <PPE_expensesList />,
      },
      {
        path: "/expenses/ppe/create",
        element: <CreatePPEExpense />,
      },
      {
        path: "/expenses/ppe/:id/edit",
        element: <EditPPEExpense />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
