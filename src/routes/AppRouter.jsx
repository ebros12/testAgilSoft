import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";


import { Login } from "../page/auth/Login";
import { Movie } from "../page/movie";
import Home from "../page/home";


const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ element, redirectTo }) => {
  return isAuthenticated() ? element : <Navigate to={redirectTo} />;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<Login />} />
      <Route
        path="/home"
        element={<ProtectedRoute element={<Home />} redirectTo="/auth" />}
      />
      <Route
        path="/movie/:id"
        element={<ProtectedRoute element={<Movie />} redirectTo="/auth" />}
      />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
