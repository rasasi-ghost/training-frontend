import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/Base/Headless";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { Course, Lecture } from "@/services/TeacherService";
import { TeacherCourseController } from "@/controllers";

interface CourseDetailsModalProps {
  open: boolean;
  onClose: () => void;
  course: Course;
  onEdit: () => void;
  onAddLecture: () => void;
  onManageEnrollments: () => void;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  open,
  onClose,
  course,
  onEdit,
  onAddLecture,
  onManageEnrollments,
}) => {
  const [loading, setLoading] = useState(true);
  const [fullCourse, setFullCourse] = useState<Course | null>(null);
  
  useEffect(() => {
    if (open && course) {
      setLoading(true);
      TeacherCourseController.getCourseDetails(course.id)
        .then((result) => {
          if (result.success && result.course) {
            setFullCourse(result.course);
          }
        })
        .catch((error) => {
          console.error("Error loading course details:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, course]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog
      size="xl"
      open={open}
      onClose={onClose}
    >
      <Dialog.Panel>
        <Dialog.Title>
          <h2 className="mr-auto text-base font-medium">
            Course Details: {course.title}
          </h2>
          <Button
            variant="outline-secondary"
            className="hidden sm:flex"
            onClick={() => window.print()}
          >
            <Lucide
              icon="Printer"
              className="w-4 h-4 mr-2"
            />{" "}
            Print Details
          </Button>
        </Dialog.Title>
        <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
          <div className="col-span-12">
            <div className="p-5 box box--stacked">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-200 rounded mb-4 w-1/2"></div>
                  <div className="h-24 bg-slate-200 rounded mb-4"></div>
                  <div className="h-8 bg-slate-200 rounded mb-4 w-1/4"></div>
                  <div className="h-40 bg-slate-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col pb-5 mb-5 border-b border-dashed sm:items-center sm:flex-row border-slate-300/70">
                    <div className="text-lg font-medium">
                      Course Information
                    </div>
                    <div className="mt-3 sm:ml-auto sm:mt-0 text-slate-500">
                      Status: 
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        course.isActive ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                      }`}>
                        {course.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 lg:col-span-6">
                      <div className="p-4 border rounded-md">
                        <h3 className="mb-3 text-base font-medium">Course Description</h3>
                        <p className="text-slate-600">{course.description || "No description available."}</p>
                      </div>
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                      <div className="p-4 border rounded-md">
                        <h3 className="mb-3 text-base font-medium">Course Details</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-slate-500 text-xs">Teacher</div>
                            <div>{course.teacherName}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">Max Enrollment</div>
                            <div>{course.maxEnrollment}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">Start Date</div>
                            <div>{formatDate(course.startDate)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">End Date</div>
                            <div>{formatDate(course.endDate)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">Current Enrollment</div>
                            <div>{course.enrollmentCount || 0} students</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs">Status</div>
                            <div className={course.isActive ? "text-success" : "text-danger"}>
                              {course.isActive ? "Active" : "Inactive"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-medium">Course Lectures</h3>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={onAddLecture}
                      >
                        <Lucide icon="Plus" className="w-4 h-4 mr-1" />
                        Add Lecture
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      {fullCourse?.lectures && fullCourse.lectures.length > 0 ? (
                        <Table bordered>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th className="whitespace-nowrap">
                                Title
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap">
                                Description
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap">
                                Start Time
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap">
                                End Time
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap">
                                Location
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {fullCourse.lectures.map((lecture: Lecture) => (
                              <Table.Tr key={lecture.id}>
                                <Table.Td className="font-medium">{lecture.title}</Table.Td>
                                <Table.Td>{lecture.description}</Table.Td>
                                <Table.Td>{formatDate(lecture.startTime)} {formatTime(lecture.startTime)}</Table.Td>
                                <Table.Td>{formatDate(lecture.endTime)} {formatTime(lecture.endTime)}</Table.Td>
                                <Table.Td>{lecture.location}</Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 border rounded-md">
                          <Lucide
                            icon="Calendar"
                            className="w-12 h-12 mx-auto text-slate-300"
                          />
                          <div className="mt-2 text-slate-500">
                            No lectures have been added to this course yet
                          </div>
                          <Button
                            variant="outline-primary"
                            className="mt-3"
                            onClick={onAddLecture}
                          >
                            <Lucide icon="Plus" className="w-4 h-4 mr-2" />
                            Add First Lecture
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
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
          <Button
            variant="outline-primary"
            type="button"
            className="w-auto mr-1"
            onClick={onEdit}
          >
            {/* <Lucide icon="Edit" className="w-4 h-4 mr-2" /> */}
            Edit Course
          </Button>
          <Button
            variant="primary"
            type="button"
            className="w-auto"
            onClick={onManageEnrollments}
          >
            <Lucide icon="Users" className="w-4 h-4 mr-2" />
            Manage Enrollments
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default CourseDetailsModal;
