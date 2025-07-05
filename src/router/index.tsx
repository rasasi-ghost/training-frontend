import { useRoutes } from "react-router-dom";
import DashboardOverview1 from "../pages/DashboardOverview1";
import DashboardOverview2 from "../pages/DashboardOverview2";
import DashboardOverview3 from "../pages/DashboardOverview3";
import DashboardOverview4 from "../pages/DashboardOverview4";
import DashboardOverview5 from "../pages/DashboardOverview5";
import DashboardOverview6 from "../pages/DashboardOverview6";
import DashboardOverview7 from "../pages/DashboardOverview7";
import DashboardOverview8 from "../pages/DashboardOverview8";
import Users from "../pages/Users";
import Departments from "../pages/Departments";
import AddUser from "../pages/AddUser";
import ProfileOverview from "../pages/ProfileOverview";
import Settings from "../pages/Settings";
import Billing from "../pages/Billing";
import Invoice from "../pages/Invoice";
import Categories from "../pages/Categories";
import AddProduct from "../pages/AddProduct";
import ProductList from "../pages/ProductList";
import ProductGrid from "../pages/ProductGrid";
import TransactionList from "../pages/TransactionList";
import TransactionDetail from "../pages/TransactionDetail";
import SellerList from "../pages/SellerList";
import SellerDetail from "../pages/SellerDetail";
import Reviews from "../pages/Reviews";
import Inbox from "../pages/Inbox";
import FileManagerList from "../pages/FileManagerList";
import FileManagerGrid from "../pages/FileManagerGrid";
import Chat from "../pages/Chat";
import Calendar from "../pages/Calendar";
import PointOfSale from "../pages/PointOfSale";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Creative from "../pages/Creative";
import Dynamic from "../pages/Dynamic";
import Interactive from "../pages/Interactive";
import RegularTable from "../pages/RegularTable";
import Tabulator from "../pages/Tabulator";
import Modal from "../pages/Modal";
import Slideover from "../pages/Slideover";
import Notification from "../pages/Notification";
import Tab from "../pages/Tab";
import Accordion from "../pages/Accordion";
import Button from "../pages/Button";
import Alert from "../pages/Alert";
import ProgressBar from "../pages/ProgressBar";
import Tooltip from "../pages/Tooltip";
import Dropdown from "../pages/Dropdown";
import Typography from "../pages/Typography";
import Icon from "../pages/Icon";
import LoadingIcon from "../pages/LoadingIcon";
import RegularForm from "../pages/RegularForm";
import Datepicker from "../pages/Datepicker";
import TomSelect from "../pages/TomSelect";
import FileUpload from "../pages/FileUpload";
import WysiwygEditor from "../pages/WysiwygEditor";
import Validation from "../pages/Validation";
import Chart from "../pages/Chart";
import Slider from "../pages/Slider";
import ImageZoom from "../pages/ImageZoom";
import LandingPage from "../pages/LandingPage";

import Layout from "../themes";
import ProtectedRoute from "../components/ProtectedRoute";
import { UserRole } from "../types/user";
import ProfileOverviewStudent from "@/pages/ProfileOverviewStudent";
import GradesStudent from "@/pages/GradesStudent";
import TeacherDashboard from "@/pages/TeacherDashboard";
import ProfileOverviewTeacher from "@/pages/ProfileOverviewTeacher";
import TeacherEnrollmentManagement from '@/pages/TeacherEnrollmentManagement';
function Router() {
  const routes = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            {
              path: "/",
              element: <ProtectedRoute allowedRoles={[UserRole.Admin]} />,
              children: [
                {
                  path: "/",
                  element: <DashboardOverview1 />,
                },
              ],
            },
            {
              path: "teacher-dashboard",
              element: <ProtectedRoute  />,
              children: [
                {
                  path: "",
                  element: <TeacherDashboard />,
                },
              ],
            },
            
            {
              path: "teacher-profile",
              element: <ProtectedRoute  />,
              children: [
                {
                  path: "",
                  element: <ProfileOverviewTeacher />,
                },
              ],
            },
            {
              path: "dashboard-overview-3",
              element: <ProtectedRoute allowedRoles={[UserRole.Student]} />,
              children: [
                {
                  path: "",
                  element: <DashboardOverview7 />,
                },
              ],
            },
            {
              path: "dashboard-overview-4",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <DashboardOverview4 />,
                },
              ],
            },

            ,
            {
              path: "enrollment-management",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <TeacherEnrollmentManagement />,
                },
              ],
            },
            {
              path: "dashboard-overview-5",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <DashboardOverview5 />,
                },
              ],
            },
            {
              path: "dashboard-overview-6",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <DashboardOverview6 />,
                },
              ],
            },
            {
              path: "dashboard-overview-7",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <DashboardOverview7 />,
                },
              ],
            },
            {
              path: "dashboard-overview-8",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <DashboardOverview8 />,
                },
              ],
            },
            {
              path: "users",
              element: <ProtectedRoute allowedRoles={[UserRole.Admin]} />,
              children: [
                {
                  path: "",
                  element: <Users />,
                },
              ],
            },
            {
              path: "departments",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Departments />,
                },
              ],
            },
            {
              path: "add-user",
              element: <ProtectedRoute allowedRoles={[UserRole.Admin]} />,
              children: [
                {
                  path: "",
                  element: <AddUser />,
                },
              ],
            },
            {
              path: "grades-student",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <GradesStudent />,
                },
              ],
            },
            {
              path: "profile-overview-student",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <ProfileOverviewStudent />,
                },
              ],
            },
            {
              path: "settings",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Settings />,
                },
              ],
            },
            {
              path: "billing",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Billing />,
                },
              ],
            },
            {
              path: "invoice",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Invoice />,
                },
              ],
            },
            {
              path: "categories",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Categories />,
                },
              ],
            },
            {
              path: "add-product",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <AddProduct />,
                },
              ],
            },
            {
              path: "product-list",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <ProductList />,
                },
              ],
            },
            {
              path: "product-grid",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <ProductGrid />,
                },
              ],
            },
            {
              path: "transaction-list",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <TransactionList />,
                },
              ],
            },
            {
              path: "transaction-detail",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <TransactionDetail />,
                },
              ],
            },
            {
              path: "seller-list",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <SellerList />,
                },
              ],
            },
            {
              path: "seller-detail",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <SellerDetail />,
                },
              ],
            },
            {
              path: "reviews",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Reviews />,
                },
              ],
            },
            {
              path: "inbox",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Inbox />,
                },
              ],
            },
            {
              path: "file-manager-list",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <FileManagerList />,
                },
              ],
            },
            {
              path: "file-manager-grid",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <FileManagerGrid />,
                },
              ],
            },
            {
              path: "chat",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Chat />,
                },
              ],
            },
            {
              path: "calendar",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Calendar />,
                },
              ],
            },
            {
              path: "point-of-sale",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <PointOfSale />,
                },
              ],
            },
            {
              path: "creative",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Creative />,
                },
              ],
            },
            {
              path: "dynamic",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Dynamic />,
                },
              ],
            },
            {
              path: "interactive",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Interactive />,
                },
              ],
            },
            {
              path: "regular-table",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <RegularTable />,
                },
              ],
            },
            {
              path: "tabulator",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Tabulator />,
                },
              ],
            },
            {
              path: "modal",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Modal />,
                },
              ],
            },
            {
              path: "slideover",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Slideover />,
                },
              ],
            },
            {
              path: "notification",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Notification />,
                },
              ],
            },
            {
              path: "tab",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Tab />,
                },
              ],
            },
            {
              path: "accordion",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Accordion />,
                },
              ],
            },
            {
              path: "button",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Button />,
                },
              ],
            },
            {
              path: "alert",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Alert />,
                },
              ],
            },
            {
              path: "progress-bar",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <ProgressBar />,
                },
              ],
            },
            {
              path: "tooltip",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Tooltip />,
                },
              ],
            },
            {
              path: "dropdown",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Dropdown />,
                },
              ],
            },
            {
              path: "typography",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Typography />,
                },
              ],
            },
            {
              path: "icon",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Icon />,
                },
              ],
            },
            {
              path: "loading-icon",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <LoadingIcon />,
                },
              ],
            },
            {
              path: "regular-form",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <RegularForm />,
                },
              ],
            },
            {
              path: "datepicker",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Datepicker />,
                },
              ],
            },
            {
              path: "tom-select",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <TomSelect />,
                },
              ],
            },
            {
              path: "file-upload",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <FileUpload />,
                },
              ],
            },
            {
              path: "wysiwyg-editor",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <WysiwygEditor />,
                },
              ],
            },
            {
              path: "validation",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Validation />,
                },
              ],
            },
            {
              path: "chart",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Chart />,
                },
              ],
            },
            {
              path: "slider",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <Slider />,
                },
              ],
            },
            {
              path: "image-zoom",
              element: <ProtectedRoute />,
              children: [
                {
                  path: "",
                  element: <ImageZoom />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/landing-page",
      element: <LandingPage />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
