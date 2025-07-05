import React, { useState, useEffect } from "react";
import { Dialog, Tab } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormLabel, FormSelect, FormTextarea } from "@/components/Base/Form";
import { TeacherCourseController } from "@/controllers";
import { Enrollment } from "@/services/TeacherService";
import StatusBadge from "./StatusBadge";

interface EnrollmentActionModalProps {
  open: boolean;
  onClose: () => void;
  enrollment: Enrollment;
  onSuccess: (message: string) => void;
}

const EnrollmentActionModal: React.FC<EnrollmentActionModalProps> = ({
  open,
  onClose,
  enrollment,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number>(enrollment.status);
  const [grade, setGrade] = useState<string>(enrollment.grade || "");
  const [feedback, setFeedback] = useState<string>("");
  
  // Reset form when enrollment changes
  useEffect(() => {
    if (open) {
      setStatus(enrollment.status);
      setGrade(enrollment.grade || "");
      setFeedback("");
      setError(null);
    }
  }, [open, enrollment]);

  // Handle status change
  const handleStatusChange = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await TeacherCourseController.updateEnrollmentStatus(enrollment.id, status);
      if (result.success) {
        let statusName = "";
        switch (status) {
          case 0: statusName = "pending"; break;
          case 1: statusName = "approved"; break;
          case 2: statusName = "completed"; break;
          case 3: statusName = "rejected"; break;
          default: statusName = "updated";
        }
        
        onSuccess(`Enrollment status has been set to ${statusName}`);
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

  // Handle grade assignment
  const handleSetGrade = async () => {
    if (!grade.trim()) {
      setError("Please enter a valid grade");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await TeacherCourseController.setStudentGrade(
        enrollment.id, 
        enrollment.studentId, 
        grade
      );
      
      if (result.success) {
        onSuccess(`Grade "${grade}" has been assigned to ${enrollment.studentName}`);
      } else {
        setError(result.error || "Failed to assign grade");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      size="lg"
      open={open}
      onClose={() => {
        if (!loading) onClose();
      }}
    >
      <Dialog.Panel>
        <Dialog.Title>
          <h2 className="mr-auto text-base font-medium">
            Manage Enrollment
          </h2>
        </Dialog.Title>
        <Dialog.Description>
          <div className="p-2">
            {error && (
              <div className="px-4 py-3 mb-4 text-sm text-white rounded-md bg-danger">
                {error}
              </div>
            )}
            
            <div className="flex flex-col mb-5 sm:flex-row">
              <div className="flex flex-1 p-5 border rounded-md">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
                  <Lucide icon="User" className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <div className="text-lg font-medium">{enrollment.studentName}</div>
                  <div className="text-slate-500 mt-0.5">Student ID: {enrollment.studentId}</div>
                  <div className="flex items-center mt-2">
                    <Lucide icon="Calendar" className="w-4 h-4 mr-1 text-slate-500" />
                    <span className="text-slate-600">Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2">
                    <StatusBadge status={enrollment.status} />
                  </div>
                </div>
              </div>
            </div>
            
            <Tab>
              <Tab.List className="nav-boxed-tabs">
                <Tab.Button className="w-full py-2">
                  Enrollment Status
                </Tab.Button>
                <Tab.Button className="w-full py-2">
                  Grade Assignment
                </Tab.Button>
              </Tab.List>
              <Tab.Panels className="mt-5">
                <Tab.Panel className="leading-relaxed">
                  <div className="p-5 border rounded-md">
                    <FormLabel htmlFor="status">Enrollment Status</FormLabel>
                    <div className="mt-2 mb-4">
                      <FormSelect
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(parseInt(e.target.value))}
                        className="w-full"
                      >
                        <option value={0}>Pending</option>
                        <option value={1}>Approved</option>
                        <option value={2}>Completed</option>
                        <option value={3}>Rejected</option>
                      </FormSelect>
                    </div>
                    
                    <div className="mt-4 p-4 bg-slate-50 rounded-md">
                      <h3 className="text-base font-medium">Status Information</h3>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li className="flex items-start">
                          <Lucide icon="Clock" className="w-4 h-4 mr-2 mt-0.5 text-warning" />
                          <span><strong>Pending:</strong> Student has requested enrollment but awaits approval</span>
                        </li>
                        <li className="flex items-start">
                          <Lucide icon="CheckCircle" className="w-4 h-4 mr-2 mt-0.5 text-success" />
                          <span><strong>Approved:</strong> Student is actively enrolled in the course</span>
                        </li>
                        <li className="flex items-start">
                          <Lucide icon="Award" className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                          <span><strong>Completed:</strong> Student has finished the course</span>
                        </li>
                        <li className="flex items-start">
                          <Lucide icon="XCircle" className="w-4 h-4 mr-2 mt-0.5 text-danger" />
                          <span><strong>Rejected:</strong> Student's enrollment request was denied</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button
                      variant="primary"
                      className="w-full mt-5"
                      onClick={handleStatusChange}
                      disabled={loading || status === enrollment.status}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          Updating Status...
                        </>
                      ) : (
                        <>
                          <Lucide icon="Save" className="w-4 h-4 mr-2" />
                          Update Status
                        </>
                      )}
                    </Button>
                  </div>
                </Tab.Panel>
                
                <Tab.Panel className="leading-relaxed">
                  <div className="p-5 border rounded-md">
                    <FormLabel htmlFor="grade">Assign Grade</FormLabel>
                    <div className="mt-2 mb-4">
                      <FormInput
                        id="grade"
                        type="text"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="Enter grade (e.g., A, B+, 95)"
                        className="w-full"
                      />
                    </div>
                    
                    <FormLabel htmlFor="feedback">Feedback (Optional)</FormLabel>
                    <div className="mt-2 mb-4">
                      <FormTextarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide feedback on student's performance"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="mt-4 p-4 bg-slate-50 rounded-md">
                      <h3 className="text-base font-medium">Grading Information</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        Grades can be assigned to students who have been approved or completed the course.
                        You can use letter grades (A, B, C), letter grades with plus/minus (A+, B-),
                        percentages (95%), or any other grading system your institution uses.
                      </p>
                    </div>
                    
                    <Button
                      variant="primary"
                      className="w-full mt-5"
                      onClick={handleSetGrade}
                      disabled={loading || grade === enrollment.grade || !grade.trim()}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          Assigning Grade...
                        </>
                      ) : (
                        <>
                          <Lucide icon="Award" className="w-4 h-4 mr-2" />
                          Assign Grade
                        </>
                      )}
                    </Button>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab>
          </div>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={onClose}
            className="w-20 mr-1"
            disabled={loading}
          >
            Close
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default EnrollmentActionModal;
