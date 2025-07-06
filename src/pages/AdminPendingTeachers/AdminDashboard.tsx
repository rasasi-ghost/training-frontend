import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import UserManagementTab from "./UserManagementTab";
import TeacherApprovalModal from './TeacherApprovalModal';
import { UserRole, TeacherApprovalStatus } from "@/services/AdminService";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/state/MobxStoreProvider";
import { formatDate } from "@/utils/formatters";

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
    <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-4 box box--stacked">
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
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

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

  // Handle approve teacher
  const handleApproveTeacher = async (teacherId: string) => {
    setProcessingIds(prev => [...prev, teacherId]);
    try {
      await adminUsecasesStore.approveTeacher(teacherId);
      // Refresh the list after approval
      await adminUsecasesStore.fetchPendingTeachers();
    } catch (error) {
      console.error("Failed to approve teacher:", error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== teacherId));
    }
  };

  // Handle reject teacher
  const handleRejectTeacher = async (teacherId: string) => {
    setProcessingIds(prev => [...prev, teacherId]);
    try {
      await adminUsecasesStore.rejectTeacher(teacherId);
      // Refresh the list after rejection
      await adminUsecasesStore.fetchPendingTeachers();
    } catch (error) {
      console.error("Failed to reject teacher:", error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== teacherId));
    }
  };

  // User statistics
  const adminCount = adminUsecasesStore.users.filter(user => user.role === UserRole.Admin).length;
  const teacherCount = adminUsecasesStore.users.filter(user => user.role === UserRole.Teacher).length;
  const studentCount = adminUsecasesStore.users.filter(user => user.role === UserRole.Student).length;
  const pendingTeacherCount = adminUsecasesStore.pendingTeachers.length;

  // Filter only pending teachers
  const pendingTeachers = adminUsecasesStore.pendingTeachers.filter(
    teacher => teacher.approvalStatus === TeacherApprovalStatus.Pending
  );

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        

        {/* Statistics Cards */}
        <div className="flex flex-col gap-8 mt-3.5">
          
          

          {/* Quick Action Buttons */}
        

          {/* Pending Teacher Requests Table */}
          <div className="col-span-12">
            <div className="flex items-center justify-between h-10 intro-y">
              <h2 className="text-lg font-medium truncate">Pending Teacher Requests</h2>
              {pendingTeachers.length > 0 && (
                <div className="flex items-center">
                  <span className="px-2 py-1 text-xs text-white rounded-full bg-danger">
                    {pendingTeachers.length} pending
                  </span>
                </div>
              )}
            </div>
            <div className="p-5 mt-5 box box--stacked">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 mb-4">
                    <Lucide icon="Loader" className="w-full h-full animate-spin text-primary" />
                  </div>
                  <p className="text-lg font-medium">Loading teacher requests...</p>
                </div>
              ) : pendingTeachers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-gray-500 border rounded-lg border-slate-200/60 bg-slate-50">
                  <Lucide icon="CheckCircle" className="w-16 h-16 mb-2 text-success" />
                  <p className="text-lg font-medium">No pending teacher requests</p>
                  <p className="text-sm text-center">All teacher applications have been processed.</p>
                </div>
              ) : (
                <Table className="border-spacing-y-[10px] border-separate">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="border-b-0 whitespace-nowrap">Name</Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">Email</Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">Department</Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">Qualification</Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">Date Applied</Table.Th>
                      <Table.Th className="text-center border-b-0 whitespace-nowrap">Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {pendingTeachers.map((teacher) => (
                      <Table.Tr key={teacher.id} className="intro-x">
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <div className="font-medium whitespace-nowrap">{teacher.displayName}</div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          {teacher.email}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          {teacher.department || "Not specified"}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <div className="truncate w-48">{teacher.qualification || "Not specified"}</div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          {formatDate(teacher.createdAt)}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] table-report__action">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApproveTeacher(teacher.id)}
                              disabled={processingIds.includes(teacher.id)}
                            >
                              {processingIds.includes(teacher.id) ? (
                                <span className="flex items-center">
                                  <Lucide icon="Loader" className="w-4 h-4 mr-1 animate-spin" />
                                  Processing
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Lucide icon="Check" className="w-4 h-4 mr-1" />
                                  Approve
                                </span>
                              )}
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRejectTeacher(teacher.id)}
                              disabled={processingIds.includes(teacher.id)}
                            >
                              <Lucide icon="X" className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => {
                                setShowTeacherApproval(true);
                              }}
                            >
                              <Lucide icon="FileText" className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </div>
          </div>

          {/* User Management Content */}
         
        </div>
      </div>

      {/* Teacher Approval Modal */}
      <TeacherApprovalModal
        open={showTeacherApproval}
        onClose={() => setShowTeacherApproval(false)}
        pendingTeachers={adminUsecasesStore.pendingTeachers}
        loading={adminUsecasesStore.loading}
        onApprove={handleApproveTeacher}
        onReject={handleRejectTeacher}
      />
    </div>
  );
});

export default AdminDashboard;
