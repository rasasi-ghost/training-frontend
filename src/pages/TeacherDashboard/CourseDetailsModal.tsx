import React from "react";
import { Dialog } from "@/components/Base/Headless";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { CoursesController } from "@/controllers";

interface CourseDetailsModalProps {
  open: boolean;
  onClose: () => void;
  course: any;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  open,
  onClose,
  course,
}) => {
  if (!course) return null;

  const enrollment = CoursesController.getEnrollmentForCourse(course.id);
  
  // Mock data for course details - in real app this would come from API
  const courseModules = [
    { id: 1, name: "Introduction", duration: "2 weeks", status: "Completed" },
    { id: 2, name: "Core Concepts", duration: "3 weeks", status: "In Progress" },
    { id: 3, name: "Advanced Topics", duration: "4 weeks", status: "Upcoming" },
    { id: 4, name: "Final Project", duration: "3 weeks", status: "Upcoming" },
  ];

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
              <div className="flex flex-col pb-5 mb-5 border-b border-dashed sm:items-center sm:flex-row border-slate-300/70">
                <div className="text-lg font-medium">
                  Course Information
                </div>
                <div className="mt-3 sm:ml-auto sm:mt-0 text-slate-500">
                  Enrollment Status: 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    enrollment?.statusString === "Approved" ? "bg-success/20 text-success" : 
                    enrollment?.statusString === "Pending" ? "bg-warning/20 text-warning" : 
                    enrollment?.statusString === "Completed" ? "bg-primary/20 text-primary" : 
                    "bg-slate-200 text-slate-600"
                  }`}>
                    {enrollment?.statusString || "Not Enrolled"}
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
                        <div className="text-slate-500 text-xs">Instructor</div>
                        <div>{course.instructorName}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs">Credits</div>
                        <div>{course.credits}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs">Start Date</div>
                        <div>{course.startDate?.substring(0, 10) || "N/A"}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs">End Date</div>
                        <div>{course.endDate?.substring(0, 10) || "N/A"}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs">Max Enrollment</div>
                        <div>{course.maxEnrollment}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs">Enrollment Date</div>
                        <div>{enrollment?.enrollmentDate?.substring(0, 10) || "N/A"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="mb-3 text-base font-medium">Course Modules</h3>
                <div className="overflow-x-auto">
                  <Table bordered hover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="whitespace-nowrap">
                          #
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap">
                          Module Name
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap">
                          Duration
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap">
                          Status
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {courseModules.map((module) => (
                        <Table.Tr key={module.id}>
                          <Table.Td>{module.id}</Table.Td>
                          <Table.Td>{module.name}</Table.Td>
                          <Table.Td>{module.duration}</Table.Td>
                          <Table.Td>
                            <div className={`px-2 py-1 text-xs rounded inline-block ${
                              module.status === "Completed" ? "bg-success/20 text-success" :
                              module.status === "In Progress" ? "bg-primary/20 text-primary" :
                              "bg-slate-200 text-slate-600"
                            }`}>
                              {module.status}
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>
              </div>
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
          {enrollment ? (
            enrollment.statusString !== "Completed" && (
              <Button
                variant="primary"
                type="button"
                className="w-auto"
              >
                {enrollment.statusString === "Pending" ? "View Pending Status" : "Access Course"}
              </Button>
            )
          ) : (
            <Button
              variant="primary"
              type="button"
              className="w-auto"
              onClick={() => {
                onClose();
                // Trigger enrollment flow - this would need to be implemented in the parent component
              }}
            >
              Enroll Now
            </Button>
          )}
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default CourseDetailsModal;
