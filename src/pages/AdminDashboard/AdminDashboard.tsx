import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import { Tab } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import UserManagementTab from "./UserManagementTab";
import CourseManagementTab from "./CourseManagementTab";
import SystemOverviewTab from "./SystemOverviewTab";
import TeacherApprovalModal from './TeacherApprovalModal';
import { UserRole } from "@/services/AdminService";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/state/MobxStoreProvider";

// Helper function to get role string from UserRole enum
const getRoleString = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return "Admin";
    case UserRole.Teacher:
      return "Teacher";
    case UserRole.Student:
      return "Student";
    default:
      return "Unknown";
  }
};

// Stat card component for the dashboard
function StatCard({
  title,
  subtitle,
  icon,
  count,
  loading = false,
  colorClass = "text-primary"
}: {
  title: string;
  subtitle: string;
  icon: string;
  count: number;
  loading?: boolean;
  colorClass?: string;
}) {
  return (
    <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
      <div className="flex items-center">
        <div className={`w-[54px] h-[54px] p-0.5 border border-${colorClass.split('-')[1]}/80 rounded-full bg-slate-50 cursor-pointer`}>
          <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70">
            <Lucide icon={icon as any} className={`w-full h-full ${colorClass}`} />
          </div>
        </div>
        <div className="ml-4">
          <div className={`-mt-0.5 text-lg font-medium ${colorClass}`}>
            {title}
          </div>
          <div className="mt-0.5 text-slate-500">{subtitle}</div>
        </div>
      </div>
      <div className="px-4 py-2.5 mt-16 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
        {loading ? (
          <div className="flex flex-col gap-2">
            <div className="h-6 bg-slate-200 animate-pulse rounded w-16"></div>
            <div className="h-4 bg-slate-200 animate-pulse rounded w-24"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <div className="text-xl font-medium leading-tight">{count}</div>
            </div>
            <div className="mt-1 text-base text-slate-500">
              {subtitle}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const AdminDashboard: React.FC = observer(() => {
  const navigate = useNavigate();
  const { adminUsecasesStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [showTeacherApproval, setShowTeacherApproval] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await adminUsecasesStore.fetchAllUsers();
        await adminUsecasesStore.fetchPendingTeachers();
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [adminUsecasesStore]);

  // User statistics
  const adminCount = adminUsecasesStore.users.filter(user => user.role === UserRole.Admin).length;
  const teacherCount = adminUsecasesStore.users.filter(user => user.role === UserRole.Teacher).length;
  const studentCount = adminUsecasesStore.users.filter(user => user.role === UserRole.Student).length;
  const pendingTeacherCount = adminUsecasesStore.pendingTeachers.length;

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            Admin Dashboard
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="flex flex-col gap-8 mt-3.5">
          <div className="grid grid-cols-12 gap-5">
            <StatCard
              title="Total Users"
              subtitle="All Users"
              icon="Users"
              count={adminUsecasesStore.users.length}
              loading={loading}
              colorClass="text-primary"
            />
            <StatCard
              title="Admins"
              subtitle="System Administrators"
              icon="Shield"
              count={adminCount}
              loading={loading}
              colorClass="text-danger"
            />
            <StatCard
              title="Teachers"
              subtitle="Course Instructors"
              icon="GraduationCap"
              count={teacherCount}
              loading={loading}
              colorClass="text-success"
            />
            <StatCard
              title="Students"
              subtitle="Enrolled Students"
              icon="BookOpen"
              count={studentCount}
              loading={loading}
              colorClass="text-warning"
            />
          </div>

          {/* Quick Action Buttons */}
          

          {/* Tabs for different management sections */}
          <Tab.Group>
            <Tab.List variant="boxed-tabs">
              <Tab>
                <Tab.Button className="w-full py-2" as="button">
                  <Lucide icon="BarChart2" className="w-4 h-4 mr-2" />
                  Overview
                </Tab.Button>
              </Tab>
              <Tab>
                <Tab.Button className="w-full py-2" as="button">
                  <Lucide icon="Users" className="w-4 h-4 mr-2" />
                  Users
                </Tab.Button>
              </Tab>
              <Tab>
                <Tab.Button className="w-full py-2" as="button">
                  <Lucide icon="BookOpen" className="w-4 h-4 mr-2" />
                  Courses
                </Tab.Button>
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-5">
              <Tab.Panel className="leading-relaxed">
                <SystemOverviewTab />
              </Tab.Panel>
              <Tab.Panel className="leading-relaxed">
                <UserManagementTab />
              </Tab.Panel>
              <Tab.Panel className="leading-relaxed">
                <CourseManagementTab />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {/* Teacher Approval Modal */}
      <TeacherApprovalModal
        open={showTeacherApproval}
        onClose={() => setShowTeacherApproval(false)}
        pendingTeachers={adminUsecasesStore.pendingTeachers}
        loading={adminUsecasesStore.loading}
        onApprove={async (teacherId) => {
          await adminUsecasesStore.approveTeacher(teacherId);
        }}
        onReject={async (teacherId, reason) => {
          await adminUsecasesStore.rejectTeacher(teacherId);
        }}
      />
    </div>
  );
});

export default AdminDashboard;
