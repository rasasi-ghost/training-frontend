import React, { useState, useEffect } from "react";
import { Dialog, Menu } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect, FormLabel } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import { TeacherCourseController } from "@/controllers";
import { Enrollment } from "@/services/TeacherService";

interface EnrollmentManagementModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  enrollments: Enrollment[];
  onSuccess: () => void;
}

const EnrollmentManagementModal: React.FC<EnrollmentManagementModalProps> = ({
  open,
  onClose,
  courseId,
  enrollments,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [gradeInput, setGradeInput] = useState<{[key: string]: string}>({});
  const [isGrading, setIsGrading] = useState<{[key: string]: boolean}>({});

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(null);
      setSearchTerm("");
      setSelectedStatus(null);
      setGradeInput({});
      setIsGrading({});
    }
  }, [open]);

  // Filtered enrollments
  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = searchTerm === "" || 
      enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === null || enrollment.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status display name
  const getStatusName = (status: number): string => {
    switch (status) {
      case 0: return "Pending";
      case 1: return "Approved";
      case 2: return "Completed";
      default: return "Unknown";
    }
  };

  // Get status badge class
  const getStatusClass = (status: number): string => {
    switch (status) {
      case 0: return "bg-warning/20 text-warning";
      case 1: return "bg-success/20 text-success";
      case 2: return "bg-primary/20 text-primary";
      default: return "bg-slate-200 text-slate-600";
    }
  };

  // Handle enrollment status change
  const handleStatusChange = async (enrollmentId: string, newStatus: number) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await TeacherCourseController.updateEnrollmentStatus(enrollmentId, newStatus);
      if (result.success) {
        setSuccess("Enrollment status updated successfully");
        onSuccess();
      } else {
        setError(result.error || "Failed to update enrollment status");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle setting a grade
  const handleSetGrade = async (enrollmentId: string, studentId: string) => {
    const grade = gradeInput[enrollmentId];
    if (!grade) {
      setError("Please enter a valid grade");
      return;
    }
    
    setIsGrading({...isGrading, [enrollmentId]: true});
    setError(null);
    setSuccess(null);
    
    try {
      const result = await TeacherCourseController.setStudentGrade(enrollmentId, studentId, grade);
      if (result.success) {
        setSuccess("Grade set successfully");
        onSuccess();
        
        // Clear the grade input for this enrollment
        const updatedGradeInput = {...gradeInput};
        delete updatedGradeInput[enrollmentId];
        setGradeInput(updatedGradeInput);
      } else {
        setError(result.error || "Failed to set grade");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsGrading({...isGrading, [enrollmentId]: false});
    }
  };

  return (
    <Dialog
      size="xl"
      open={open}
      onClose={() => {
        if (!loading) onClose();
      }}
    >
      <Dialog.Panel>
        <Dialog.Title>
          <h2 className="mr-auto text-base font-medium">Manage Course Enrollments</h2>
        </Dialog.Title>
        <Dialog.Description>
          <div className="p-2">
            {error && (
              <div className="px-4 py-3 mb-4 text-sm text-white rounded-md bg-danger">
                {error}
              </div>
            )}
            
            {success && (
              <div className="px-4 py-3 mb-4 text-sm text-white rounded-md bg-success">
                {success}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="sm:w-1/2">
                <div className="relative">
                  <Lucide
                    icon="Search"
                    className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
                  />
                  <FormInput
                    type="text"
                    placeholder="Search by student name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full rounded-[0.5rem]"
                  />
                </div>
              </div>
              <div className="sm:w-1/2">
                <FormSelect 
                  value={selectedStatus !== null ? selectedStatus.toString() : ""}
                  onChange={(e) => setSelectedStatus(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full rounded-[0.5rem]"
                >
                  <option value="">All Statuses</option>
                  <option value="0">Pending</option>
                  <option value="1">Approved</option>
                  <option value="2">Completed</option>
                </FormSelect>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {enrollments.length === 0 ? (
                <div className="text-center p-8 border rounded-md">
                  <Lucide
                    icon="Users"
                    className="w-12 h-12 mx-auto text-slate-300"
                  />
                  <div className="mt-2 text-slate-500">
                    No enrollments found for this course
                  </div>
                </div>
              ) : filteredEnrollments.length === 0 ? (
                <div className="text-center p-8 border rounded-md">
                  <Lucide
                    icon="Search"
                    className="w-12 h-12 mx-auto text-slate-300"
                  />
                  <div className="mt-2 text-slate-500">
                    No enrollments match your search criteria
                  </div>
                </div>
              ) : (
                <Table bordered>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="whitespace-nowrap">
                        Student Name
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap">
                        Enrollment Date
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap">
                        Status
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap">
                        Grade
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap">
                        Actions
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredEnrollments.map((enrollment) => (
                      <Table.Tr key={enrollment.id}>
                        <Table.Td className="font-medium">
                          {enrollment.studentName}
                        </Table.Td>
                        <Table.Td>
                          {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </Table.Td>
                        <Table.Td>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(enrollment.status)}`}>
                            {getStatusName(enrollment.status)}
                          </span>
                        </Table.Td>
                        <Table.Td>
                          {enrollment.status === 2 ? (
                            enrollment.grade ? (
                              <span className="font-medium">{enrollment.grade}</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <FormInput
                                  type="text"
                                  value={gradeInput[enrollment.id] || ""}
                                  onChange={(e) => setGradeInput({...gradeInput, [enrollment.id]: e.target.value})}
                                  className="w-20 h-8 text-center"
                                  placeholder="A, B, C..."
                                />
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleSetGrade(enrollment.id, enrollment.studentId)}
                                  disabled={isGrading[enrollment.id]}
                                >
                                  {isGrading[enrollment.id] ? (
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    "Set"
                                  )}
                                </Button>
                              </div>
                            )
                          ) : (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <div className="flex justify-center">
                            <Menu>
                              <Menu.Button as={Button} variant="outline-secondary" size="sm">
                                <Lucide icon="MoreHorizontal" className="w-4 h-4" />
                              </Menu.Button>
                              <Menu.Items className="w-48">
                                {enrollment.status === 0 && (
                                  <Menu.Item onClick={() => handleStatusChange(enrollment.id, 1)}>
                                    <Lucide icon="CheckCircle" className="w-4 h-4 mr-2 text-success" />
                                    Approve Enrollment
                                  </Menu.Item>
                                )}
                                {enrollment.status === 1 && (
                                  <Menu.Item onClick={() => handleStatusChange(enrollment.id, 2)}>
                                    <Lucide icon="Award" className="w-4 h-4 mr-2 text-primary" />
                                    Mark as Completed
                                  </Menu.Item>
                                )}
                                {enrollment.status === 0 && (
                                  <Menu.Item onClick={() => handleStatusChange(enrollment.id, 3)}>
                                    <Lucide icon="XCircle" className="w-4 h-4 mr-2 text-danger" />
                                    Reject Enrollment
                                  </Menu.Item>
                                )}
                                <Menu.Item>
                                  <Lucide icon="Mail" className="w-4 h-4 mr-2" />
                                  Contact Student
                                </Menu.Item>
                              </Menu.Items>
                            </Menu>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </div>
          </div>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={onClose}
            className="w-20 mr-1"
          >
            Close
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default EnrollmentManagementModal;