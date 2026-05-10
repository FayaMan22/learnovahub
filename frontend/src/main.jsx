import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

import Layout from "./components/common/Layout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AdminRoute from "./components/common/AdminRoute.jsx";

import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import LessonsPage from "./pages/LessonsPage";
import AdminPage from "./pages/AdminPage";
import LessonDetailPage from "./pages/LessonDetailPage";
import QuizPage from "./pages/QuizPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import PaymentCancelledPage from "./pages/PaymentCancelledPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "pricing",
        element: <PricingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "lessons",
        element: <LessonsPage />,
      },
      {
        path: "lessons/:id",
        element: <LessonDetailPage />,
      },
      {
        path: "lessons/:id/quiz",
        element: <QuizPage />,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        ),
      },
      {
        path: "payment-success",
        element: <PaymentSuccessPage />,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelledPage />,
      },
      {
        path: "progress",
        element: (
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);