import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "@/components/Base/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  badge?: number;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | string>;
}

const adminMenu: Array<Menu | string> = [
  "My Dashboard",
  {
    icon: "LayoutDashboard",
    pathname: "/admin-dashboard",
    title: "Home",
  },
  "USER MANAGEMENT",
  {
    icon: "Users",
    pathname: "/user-management",
    title: "Users",
  },
  {
    icon: "ClipboardCheck",
    pathname: "/admin-pending-teachers",
    title: "Pending Requests",
  }
  // More admin-specific items...
];

const teacherMenu: Array<Menu | string> = [
  "My Dashboard",
  {
    icon: "LayoutDashboard",
    pathname: "/teacher-dashboard",
    title: "Home",
  },
  "COURSE MANAGEMENT",
  {
    icon: "BookOpen",
    pathname: "/teacher-courses",
    title: "Course Management",
  },
  {
    icon: "UserPlus",
    pathname: "/enrollment-management",
    title: "Enrollment Management",
  },
  "APPS",
  {
    icon: "Calendar",
    pathname: "/calendar",
    title: "Calendar",
  },
  
  "PERSONAL DASHBOARD",
  {
    icon: "User",
    pathname: "/teacher-profile",
    title: "Profile Overview",
  }
  // More teacher-specific items...
];

const studentMenu: Array<Menu | string> = [
  "Student Dashboard",
  {
    icon: "LayoutDashboard",
    pathname: "/dashboard-overview-7",
    title: "Home",
  },

  {
    icon: "Award",
    pathname: "/grades-student",
    title: "Grades",
  },
  "APPS",
  {
    icon: "Calendar",
    pathname: "/calendar",
    title: "Calendar",
  },
  "PERSONAL DASHBOARD",
  {
    icon: "User",
    pathname: "/profile-overview-student",
    title: "Profile",
  },
  // More student-specific items...
];

const roleMenuMap = {
  Admin: adminMenu,
  Teacher: teacherMenu,
  Student: studentMenu,
};

// Initialize from localStorage or default to admin
const getUserRole = (): "Admin" | "Teacher" | "Student" => {
  const storedRole = localStorage.getItem("userRole");
  if (storedRole === "Admin" || storedRole === "Teacher" || storedRole === "Student") {
    return storedRole;
  }
  return "Admin"; // Default role
};

const initialState: SideMenuState = {

  menu: roleMenuMap[getUserRole()] || roleMenuMap.Admin,

};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<"Admin" | "Teacher" | "Student">) => {
      state.menu = roleMenuMap[action.payload];
      localStorage.setItem("userRole", action.payload);
    },
  },
});
export const {
  setRole
} = sideMenuSlice.actions;

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
