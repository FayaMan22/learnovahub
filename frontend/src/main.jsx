import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

import Layout from "./components/common/Layout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AdminRoute from "./components/common/AdminRoute.jsx";
import TeacherRoute from "./components/common/TeacherRoute.jsx";

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
import AdminLearnersPage from "./pages/AdminLearnersPage.jsx";
import AdminLearnerDetailPage from "./pages/AdminLearnerDetailPage";
import AdminLessonsPage from "./pages/AdminLessonsPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage.jsx";
import TeacherLessonsPage from "./pages/TeacherLessonsPage.jsx";
import TeacherQuizPage from "./pages/TeacherQuizPage.jsx";
import TeacherCoursesPage from "./pages/TeacherCoursesPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import MyCoursesPage from "./pages/MyCoursesPage.jsx";
import AnnouncementsPage from "./pages/AnnouncementsPage.jsx";
import TeacherLearnersPage from "./pages/TeacherLearnersPage.jsx";
import TeacherLearnerDetailPage from "./pages/TeacherLearnerDetailPage.jsx";
import AdminSubscriptionsPage from "./pages/AdminSubscriptionsPage.jsx";
import TeacherAssignmentsPage from "./pages/TeacherAssignmentsPage";
import AssignmentDetailPage from "./pages/AssignmentDetailPage.jsx";

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
        path: "courses",
        element: <CoursesPage /> 
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
        path: "courses/:courseId",
        element: <CourseDetailPage />,
      },
      {
        path: "my-courses",
        element: <MyCoursesPage />,
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
        path: "admin/learners",
        element: (
          <AdminRoute>
            <AdminLearnersPage />
          </AdminRoute>
        ),
      },
      {
        path: "teacher",
        element: (
          <TeacherRoute>
            <TeacherDashboardPage />
          </TeacherRoute>
        ),
      },
      {
        path: "teacher/lessons",
        element: (
          <TeacherRoute>
            <TeacherLessonsPage />
          </TeacherRoute>
        ),
      },
      {
        path: "teacher/lessons/:lessonId/quiz",
        element: (
          <TeacherRoute>
            <TeacherQuizPage />
          </TeacherRoute>
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
      {
        path: "admin/learners/:learnerId",
        element: (
          <AdminRoute>
            <AdminLearnerDetailPage />
          </AdminRoute>
        ),
      },
      {
        path: "teacher/courses",
        element: (
          <TeacherRoute>
            <TeacherCoursesPage />
          </TeacherRoute>
        ),
      },
      {
        path: "admin/subscriptions",
        element: (
          <AdminRoute>
            <AdminSubscriptionsPage />
          </AdminRoute>
        ),
      },
      {
        path: "announcements",
        element: <AnnouncementsPage />,
      },
      {
        path: "announcements/:announcementId",
        element: <AnnouncementsPage />,
      },
      {
        path: "teacher/learners",
        element: (
          <TeacherRoute>
            <TeacherLearnersPage />
          </TeacherRoute>
        ),
      },
      {
        path: "teacher/learners/:learnerId",
        element: (
          <TeacherRoute>
            <TeacherLearnerDetailPage />
          </TeacherRoute>
        ),
      },
      {
        path: "teacher/assignments",
        element: (
          <TeacherRoute>
            <TeacherAssignmentsPage />
          </TeacherRoute>
        ),
      },
      {
        path: "assignments/:assignmentId",
        element: (
          <ProtectedRoute>
            <AssignmentDetailPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);