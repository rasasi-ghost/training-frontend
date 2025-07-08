import React from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "../types/user";
import UserStore from "../state/UserStore";
import { observer } from "mobx-react-lite";

const RoleBasedDashboardRedirect: React.FC = observer(() => {
    const { isAuthenticated, loading, currentUser, isAdmin, isStudent, isTeacher } = UserStore;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!currentUser) {
        console.log("No current user found, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    if (!loading && currentUser) {

        if (isAdmin) {
            return <Navigate to="/admin-dashboard" replace />;

        }
        if (isTeacher) {

            return <Navigate to="/teacher-dashboard" replace />;
        } if (isStudent) {
            return <Navigate to="/dashboard-overview-3" replace />;

        }
        else
            return <Navigate to="/login" replace />

    }

    // console.log("Current user role:", currentUser.role.toString());
    // console.log(UserRole.Admin, UserRole.Teacher, UserRole.Student);
    // switch (currentUser.role) {
    //     case UserRole.Admin.toString():
    //         console.log("Redirecting to admin dashboard");
    //         return <Navigate to="/admin-dashboard" replace />;
    //     case UserRole.Teacher:
    //         console.log("Redirecting to teacher dashboard");
    //         return <Navigate to="/teacher-dashboard" replace />;
    //     case UserRole.Student:
    //         console.log("Redirecting to student dashboard");
    //         return <Navigate to="/dashboard-overview-3" replace />;
    //     default:
    //         console.log("Unknown role, redirecting to login");
    //         return <Navigate to="/login" replace />;
    // }
});

export default RoleBasedDashboardRedirect;
