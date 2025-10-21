import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="page-container">
    <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
    <p className="text-lg text-gray-600 mb-6">
      Oops! The page you’re looking for doesn’t exist.
    </p>
    <Link to="/" className="btn-primary">Go Back Home</Link>
  </div>
);

export default NotFoundPage;
