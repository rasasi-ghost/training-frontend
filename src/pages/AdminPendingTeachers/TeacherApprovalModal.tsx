import React, { useState } from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormTextarea } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import { Teacher, TeacherApprovalStatus } from "@/services/AdminService";

interface TeacherApprovalModalProps {
  open: boolean;
  onClose: () => void;
  pendingTeachers: Teacher[];
  loading: boolean;
  onApprove: (teacherId: string) => Promise<void>;
  onReject: (teacherId: string, reason?: string) => Promise<void>;
}

const TeacherApprovalModal: React.FC<TeacherApprovalModalProps> = ({
  open,
  onClose,
  pendingTeachers,
  loading,
  onApprove,
  onReject,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionTeacherId, setRejectionTeacherId] = useState<string | null>(null);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleApprove = async (teacherId: string) => {
    setActionLoading(true);
    try {
      await onApprove(teacherId);
    } catch (error) {
      console.error("Failed to approve teacher:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleShowRejectionForm = (teacherId: string) => {
    setRejectionTeacherId(teacherId);
    setRejectionReason("");
    setShowRejectionForm(true);
  };

  const handleReject = async () => {
    if (!rejectionTeacherId) return;
    
    setActionLoading(true);
    try {
      await onReject(rejectionTeacherId, rejectionReason);
      setShowRejectionForm(false);
      setRejectionTeacherId(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Failed to reject teacher:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
    >
      <Dialog.Panel className="p-0">
        <div className="px-5 py-3 border-b border-slate-200/60">
          <div className="flex items-center">
            <div className="mr-auto text-base font-medium">
              Teacher Approval Requests
            </div>
            <Button
              variant="outline-secondary"
              className="hidden sm:flex"
              onClick={onClose}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {showRejectionForm ? (
          <div className="p-5">
            <div className="text-base font-medium mb-3">Rejection Reason</div>
            <FormTextarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowRejectionForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <div className="flex items-center">
                    <Lucide icon="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Confirm Rejection"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-5">
              {loading ? (
                // Shimmer loading effect
                <div className="overflow-auto xl:overflow-visible">
                  <div className="min-w-full">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="border-b border-slate-200/60 p-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                          <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                          <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                          <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : pendingTeachers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">
                    <Lucide
                      icon="CheckCircle"
                      className="w-16 h-16 mx-auto text-success"
                    />
                  </div>
                  <div className="text-xl font-medium">No Pending Requests</div>
                  <div className="text-slate-500 mt-2">
                    There are no pending teacher approval requests at this time.
                  </div>
                </div>
              ) : (
                <Table className="border-spacing-y-[10px] border-separate">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="border-b-0 whitespace-nowrap">Teacher</Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">Department</Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">Qualification</Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap text-center">Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {pendingTeachers.map((teacher) => (
                      <Table.Tr key={teacher.id} className="bg-slate-50">
                        <Table.Td className="first:rounded-l-md last:rounded-r-md border-b-0 dark:bg-darkmode-600">
                          <div className="flex items-center">
                            <div className="w-9 h-9 image-fit zoom-in rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                              <Lucide
                                icon="GraduationCap"
                                className="w-5 h-5 text-success"
                              />
                            </div>
                            <div className="ml-3.5">
                              <div className="font-medium whitespace-nowrap">
                                {teacher.displayName}
                              </div>
                              <div className="text-slate-500 text-xs mt-0.5">
                                {teacher.email}
                              </div>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md border-b-0 dark:bg-darkmode-600">
                          <div className="whitespace-nowrap">
                            {teacher.department || "Not specified"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md border-b-0 dark:bg-darkmode-600">
                          <div className="whitespace-nowrap">
                            {teacher.qualification || "Not specified"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md border-b-0 dark:bg-darkmode-600 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApprove(teacher.id)}
                              disabled={actionLoading}
                            >
                              <Lucide icon="Check" className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleShowRejectionForm(teacher.id)}
                              disabled={actionLoading}
                            >
                              <Lucide icon="X" className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </div>
            <div className="px-5 py-3 border-t border-slate-200/60 text-right">
              <Button
                variant="outline-secondary"
                onClick={onClose}
                className="w-20 mr-1"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </Dialog.Panel>
    </Dialog>
  );
};

export default TeacherApprovalModal;
