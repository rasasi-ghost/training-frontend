import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../types/user";
import UserStore from "../state/UserStore";
import { observer } from "mobx-react-lite";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = observer(({ allowedRoles }) => {
  const { isAuthenticated, loading, currentUser } = UserStore;

  if (loading) {
    // Show a loading spinner or indicator
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    console.log("User is not authenticated or currentUser is null");
    // Redirect to login if not authenticated
    // alert("You are not authenticated. Please log in.");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on role if they don't have permission
    return <Navigate to={UserStore.dashboardRoute} replace />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
});

export default ProtectedRoute;
