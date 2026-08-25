import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddLink from "./pages/AddLink";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Categories from "./pages/Categories";
import CategoryBookmarks from "./pages/CategoryBookmarks";
import BookmarkDetail from "./pages/BookmarkDetail";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/categories" element={<Categories />} />
        <Route
          path="/category/:id"
          element={<CategoryBookmarks />}
        />

        <Route
          path="/bookmark/:id"
          element={<BookmarkDetail />}
        />

        {/* Protected routes */}
        <Route
          path="/add-link"
          element={
            <PrivateRoute>
              <AddLink />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;