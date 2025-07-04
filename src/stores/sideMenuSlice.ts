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
  "DASHBOARDS",
  {
    icon: "GaugeCircle",
    pathname: "/",
    title: "E-Commerce",
  },
  {
    icon: "ActivitySquare",
    pathname: "/dashboard-overview-2",
    title: "CRM",
  },
  "USER MANAGEMENT",
  {
    icon: "SquareUser",
    pathname: "/users",
    title: "Users",
  },
  {
    icon: "CakeSlice",
    pathname: "/departments",
    title: "Departments",
  },
  {
    icon: "PackagePlus",
    pathname: "/add-user",
    title: "Add User",
  },
  "APPS",
  {
    icon: "GanttChartSquare",
    pathname: "/inbox",
    title: "Inbox",
    badge: 4,
  },
  {
    icon: "PanelRightClose",
    pathname: "/file-manager-list",
    title: "File Manager List",
  },
  "GENERAL SETTINGS",
  {
    icon: "Briefcase",
    pathname: "/settings",
    title: "Profile Info",
  },
  {
    icon: "MailCheck",
    pathname: "/settings?page=email-settings",
    title: "Email Settings",
  },
  // More admin-specific items...
];

const teacherMenu: Array<Menu | string> = [
  "DASHBOARDS",
  {
    icon: "Album",
    pathname: "/dashboard-overview-3",
    title: "Hospital",
  },
  "APPS",
  {
    icon: "MailOpen",
    pathname: "/chat",
    title: "Chat",
  },
  {
    icon: "CalendarRange",
    pathname: "/calendar",
    title: "Calendar",
  },
  "UI WIDGETS",
  {
    icon: "Keyboard",
    pathname: "/interactive",
    title: "Interactive",
  },
  "PERSONAL DASHBOARD",
  {
    icon: "Presentation",
    pathname: "/profile-overview",
    title: "Profile Overview",
  },
  "E-COMMERCE",
  {
    icon: "BookMarked",
    pathname: "/categories",
    title: "Categories",
  },
  // More teacher-specific items...
];

const studentMenu: Array<Menu | string> = [
  "DASHBOARDS",
  {
    icon: "MousePointerSquare",
    pathname: "/dashboard-overview-6",
    title: "Cafe",
  },
  "APPS",
  {
    icon: "CalendarRange",
    pathname: "/calendar",
    title: "Calendar",
  },
  "PERSONAL DASHBOARD",
  {
    icon: "CalendarRange",
    pathname: "/profile-overview?page=events",
    title: "Events",
  },
  {
    icon: "Medal",
    pathname: "/profile-overview?page=achievements",
    title: "Achievements",
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
  const storedRole = localStorage.getItem("role");
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
