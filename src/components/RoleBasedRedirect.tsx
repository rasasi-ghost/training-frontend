import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/user";
import UserStore from "../state/UserStore";

const RoleBasedRedirect: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const { isAuthenticated, isAdmin, isStudent, isTeacher } = UserStore;

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {

      if (isAdmin) {
        navigate("/admin-dashboard");

      }
      if (isTeacher) {
        navigate("/teacher-dashboard");

      } if (isStudent) {
        navigate("/dashboard-overview-3");

      }
      else
        navigate("/login");

      // switch (currentUser.role) {
      //   case UserRole.Admin:
      //     navigate("/");
      //     break;
      //   case UserRole.Teacher:
      //     navigate("/dashboard-overview-2");
      //     break;
      //   case UserRole.Student:
      //     navigate("/dashboard-overview-3");
      //     break;
      //   default:
      //     navigate("/login");
      // }
    } else if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl">Redirecting...</div>
    </div>
  );
};

export default RoleBasedRedirect;
