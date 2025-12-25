import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AddLink from "./pages/AddLink";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Categories from "./pages/Categories";
import CategoryBookmarks from "./pages/CategoryBookmarks";
import BookmarkDetail from "./pages/BookmarkDetail";
import Footer from "./components/Footer";





function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-link" element={<AddLink />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:id" element={<CategoryBookmarks />} />
        <Route path="/bookmark/:id" element={<BookmarkDetail />} />



        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
     
      <Footer />
    </Router>


  );


}

export default App;
