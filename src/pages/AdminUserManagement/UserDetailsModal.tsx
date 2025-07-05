import React from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { User, UserRole, Teacher, Student, AdminUser } from "@/services/AdminService";

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onDelete: (userId: string) => void;
}

const getRoleString = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return "Administrator";
    case UserRole.Teacher:
      return "Teacher";
    case UserRole.Student:
      return "Student";
    default:
      return "Unknown";
  }
};

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  open,
  onClose,
  user,
  onDelete,
}) => {
  const isAdmin = user.role === UserRole.Admin;
  const isTeacher = user.role === UserRole.Teacher;
  const isStudent = user.role === UserRole.Student;

  // Type assertions for specific role information
  const adminUser = isAdmin ? user as AdminUser : null;
  const teacherUser = isTeacher ? user as Teacher : null;
  const studentUser = isStudent ? user as Student : null;

  const userCreatedDate = new Date(user.createdAt);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
    >
      <Dialog.Panel>
        <div className="p-5">
          <div className="flex items-center">
            <div className="mr-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
                <Lucide
                  icon={isAdmin ? "Shield" : isTeacher ? "GraduationCap" : "User"}
                  className={`w-6 h-6 ${
                    isAdmin ? "text-danger" : isTeacher ? "text-success" : "text-primary"
                  }`}
                />
              </div>
            </div>
            <div>
              <div className="text-lg font-medium">{user.displayName}</div>
              <div className="text-slate-500">{user.email}</div>
            </div>
            <div className="ml-auto flex">
              <Button
                variant="outline-secondary"
                onClick={onClose}
                className="mr-2"
              >
                <Lucide icon="X" className="w-4 h-4 mr-2" /> Close
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onDelete(user.id);
                  onClose();
                }}
              >
                <Lucide icon="Trash2" className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col p-5 box box--stacked">
              <h2 className="text-base font-medium pb-3 border-b border-slate-200/60">
                User Information
              </h2>
              <div className="mt-3 flex flex-col space-y-4">
                <div className="flex justify-between">
                  <div className="text-slate-500">ID</div>
                  <div className="font-medium">{user.id}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-slate-500">Name</div>
                  <div className="font-medium">{user.displayName}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-slate-500">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-slate-500">Role</div>
                  <div className="font-medium">
                    <div
                      className={`px-2 py-0.5 rounded text-xs ${
                        isAdmin ? "bg-danger/20 text-danger" : 
                        isTeacher ? "bg-success/20 text-success" : 
                        "bg-primary/20 text-primary"
                      }`}
                    >
                      {getRoleString(user.role)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-slate-500">Created</div>
                  <div className="font-medium">
                    {userCreatedDate.toLocaleDateString()} {userCreatedDate.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-5 box box--stacked">
              <h2 className="text-base font-medium pb-3 border-b border-slate-200/60">
                Role-Specific Information
              </h2>
              <div className="mt-3 flex flex-col space-y-4">
                {isAdmin && adminUser && (
                  <>
                    <div className="flex justify-between">
                      <div className="text-slate-500">Super Admin</div>
                      <div className="font-medium">
                        {adminUser.isSuperAdmin ? "Yes" : "No"}
                      </div>
                    </div>
                  </>
                )}

                {isTeacher && teacherUser && (
                  <>
                    <div className="flex justify-between">
                      <div className="text-slate-500">Department</div>
                      <div className="font-medium">
                        {teacherUser.department || "Not specified"}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-slate-500">Qualification</div>
                      <div className="font-medium">
                        {teacherUser.qualification || "Not specified"}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-slate-500">Approval Status</div>
                      <div className="font-medium">
                        <div
                          className={`px-2 py-0.5 rounded text-xs ${
                            teacherUser.approvalStatus === 0 ? "bg-warning/20 text-warning" : 
                            teacherUser.approvalStatus === 1 ? "bg-success/20 text-success" : 
                            "bg-danger/20 text-danger"
                          }`}
                        >
                          {teacherUser.approvalStatus === 0 ? "Pending" : 
                           teacherUser.approvalStatus === 1 ? "Approved" : 
                           "Rejected"}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {isStudent && studentUser && (
                  <>
                    <div className="flex justify-between">
                      <div className="text-slate-500">Student ID</div>
                      <div className="font-medium">
                        {studentUser.studentId || "Not assigned"}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-slate-500">Year</div>
                      <div className="font-medium">
                        {studentUser.year || "Not specified"}
                      </div>
                    </div>
                  </>
                )}

                {!isAdmin && !isTeacher && !isStudent && (
                  <div className="text-slate-500 text-center py-8">
                    No additional information available for this role.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default UserDetailsModal;
