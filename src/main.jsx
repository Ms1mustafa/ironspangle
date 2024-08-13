import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
// import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

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
import SDsList from "./pages/expenses/sd/SDsList.jsx";
import ViewSD from "./pages/expenses/sd/ViewSD.jsx";
import SDWorkersList from "./pages/expenses/sd/worker/SDWorkersList.jsx";
import CreateSD from "./pages/expenses/sd/CreateSD.jsx";
import EditSD from "./pages/expenses/sd/EditSD.jsx";
import CreateSDWorker from "./pages/expenses/sd/worker/CreateSDWorker.jsx";
import EditSDWorker from "./pages/expenses/sd/worker/EditSDWorker.jsx";

import CreateEmployee_company from "./pages/employee_company/CreateEmployee_company.jsx";
import EditEmployee_company from "./pages/employee_company/EditEmployee_company.jsx";
import Employee_companyList from "./pages/employee_company/Employee_companyList.jsx";

import CreateAdmin from "./pages/admin/CreateAdmin.jsx";
import CopyAdmin from "./pages/admin/CopyAdmin.jsx";
import AdminList from "./pages/admin/AdminList.jsx";
import EditAdmin from "./pages/admin/EditAdmin.jsx";
import ViewAdmin from "./pages/admin/ViewAdmin.jsx";
import AdminWorkersList from "./pages/admin/worker/AdminWorkersList.jsx";
import CreateAdminWorker from "./pages/admin/worker/CreateAdminWorker.jsx";
import EditAdminWorker from "./pages/admin/worker/EditAdminWorker.jsx";

import CreateMEC from "./pages/mec/CreateMec.jsx";
import CopyMEC from "./pages/mec/CopyMec.jsx";
import MECList from "./pages/mec/MecList.jsx";
import EditMEC from "./pages/mec/EditMec.jsx";
import ViewMEC from "./pages/mec/ViewMec.jsx";
import MECWorkersList from "./pages/mec/worker/MecWorkersList.jsx";
import CreateMECWorker from "./pages/mec/worker/CreateMecWorker.jsx";
import EditMECWorker from "./pages/mec/worker/EditMECWorker.jsx";

import CreateSupply_chain from "./pages/supply_chain/CreateSupply_chain.jsx";
import CopySupply_chain from "./pages/supply_chain/CopySupply_chain.jsx";
import Supply_chainList from "./pages/supply_chain/Supply_chainList.jsx";
import EditSupply_chain from "./pages/supply_chain/EditSupply_chain.jsx";
import ViewSupply_chain from "./pages/supply_chain/ViewSupply_chain.jsx";
import Supply_chainWorkersList from "./pages/supply_chain/worker/Supply_chainWorkersList.jsx";
import CreateSupply_chainWorker from "./pages/supply_chain/worker/CreateSupply_chainWorker.jsx";
import EditSupply_chainWorker from "./pages/supply_chain/worker/EditSupply_chainWorker.jsx";

import Summary from "./pages/summary/Summary.jsx";

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
      {
        path: "/expenses/sd",
        element: <SDsList />,
      },
      {
        path: "/expenses/sd/:id",
        element: <ViewSD />,
        children: [
          {
            path: "workers",
            element: <SDWorkersList />,
          },
        ],
      },
      {
        path: "/expenses/sd/:id/workers",
        element: <ViewSD />,
      },
      {
        path: "/expenses/sd/create",
        element: <CreateSD />,
      },
      {
        path: "/expenses/sd/:id/edit",
        element: <EditSD />,
      },
      {
        path: "/expenses/sd/:id/workers/create",
        element: <CreateSDWorker />,
      },
      {
        path: "/expenses/sd/:sd_id/workers/:workerId/edit",
        element: <EditSDWorker />,
      },
      //summary
      {
        path: "/summary",
        element: <Summary />,
      },

      //employee_company
      {
        path: "/employee_company",
        element: <Employee_companyList />,
      },
      {
        path: "/employee_company/create",
        element: <CreateEmployee_company />,
      },
      {
        path: "/employee_company/:id/edit",
        element: <EditEmployee_company />,
      },
      // Admin Routes
      {
        path: "/admin/create",
        element: <CreateAdmin />,
      },
      {
        path: "/admin/:id/edit",
        element: <EditAdmin />,
      },
      {
        path: "/admin/:id/copy",
        element: <CopyAdmin />,
      },
      {
        path: "/admin/:id",
        element: <ViewAdmin />,
        children: [
          {
            path: "workers",
            element: <AdminWorkersList />,
          },
        ],
      },
      {
        path: "/admin",
        element: <AdminList />,
      },
      {
        path: "/admin/:id/workers/create",
        element: <CreateAdminWorker />,
      },
      {
        path: "/admin/:admin_id/workers/:worker_id/edit",
        element: <EditAdminWorker />,
      },

      // MEC Routes
      {
        path: "/mec/create",
        element: <CreateMEC />,
      },
      {
        path: "/mec/:id/edit",
        element: <EditMEC />,
      },
      {
        path: "/mec/:id/copy",
        element: <CopyMEC />,
      },
      {
        path: "/mec/:id",
        element: <ViewMEC />,
        children: [
          {
            path: "workers",
            element: <MECWorkersList />,
          },
        ],
      },
      {
        path: "/mec",
        element: <MECList />,
      },
      {
        path: "/mec/:id/workers/create",
        element: <CreateMECWorker />,
      },
      {
        path: "/mec/:mec_id/workers/:worker_id/edit",
        element: <EditMECWorker />,
      },
      // supply_chain Routes
      {
        path: "/supply_chain/create",
        element: <CreateSupply_chain />,
      },
      {
        path: "/supply_chain/:id/edit",
        element: <EditSupply_chain />,
      },
      {
        path: "/supply_chain/:id/copy",
        element: <CopySupply_chain />,
      },
      {
        path: "/supply_chain/:id",
        element: <ViewSupply_chain />,
        children: [
          {
            path: "workers",
            element: <Supply_chainWorkersList />,
          },
        ],
      },
      {
        path: "/supply_chain",
        element: <Supply_chainList />,
      },
      {
        path: "/supply_chain/:id/workers/create",
        element: <CreateSupply_chainWorker />,
      },
      {
        path: "/supply_chain/:supply_chain_id/workers/:worker_id/edit",
        element: <EditSupply_chainWorker />,
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
