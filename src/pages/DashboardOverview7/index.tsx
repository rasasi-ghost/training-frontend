import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import { FormSelect, FormInput } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import Button from "@/components/Base/Button";
import { CoursesController } from "@/controllers";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { Menu, Dialog } from "@/components/Base/Headless";
import Table from "@/components/Base/Table";
import clsx from "clsx";
import CourseDetailsModal from "./CourseDetailsModal";

function CourseCard({
  title,
  subtitle,
  icon,
  count,
  status,
  loading = false,
  grade = null
}: {
  title: string;
  subtitle: string;
  icon: string;
  count: number;
  status: string;
  loading?: boolean;
  grade?: number | null;
}) {
  return (
    <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
      <div className="flex items-center">
        <div className="w-[54px] h-[54px] p-0.5 border border-primary/80 rounded-full bg-slate-50 cursor-pointer">
          <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70">
            <Lucide icon={icon} className="w-full h-full" />
          </div>
        </div>
        <div className="ml-4">
          <div className="-mt-0.5 text-lg font-medium text-primary">
            {title}
          </div>
          <div className="mt-0.5 text-slate-500">{subtitle}</div>
        </div>
      </div>
      <div className="px-4 py-2.5 mt-16 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
        {loading ? (
          <div className="flex justify-center py-2">
            <LoadingIcon icon="oval" className="w-8 h-8" />
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <div className="text-xl font-medium leading-tight">{count}</div>
              {grade !== null && (
                <div className={`flex items-center ml-2.5 font-medium ${grade >= 70 ? 'text-success' : 'text-danger'}`}>
                  Grade: {grade}%
                </div>
              )}
              {status && (
                <div className={`ml-2.5 px-2 py-0.5 rounded text-xs font-medium ${status === "Pending" ? "bg-warning/20 text-warning" :
                  status === "Approved" ? "bg-success/20 text-success" :
                    "bg-primary/20 text-primary"
                  }`}>
                  {status}
                </div>
              )}
            </div>
            <div className="mt-1 text-base text-slate-500">
              {grade !== null ? "Completed Course" : status === "Pending" ? "Awaiting Approval" : "Active Course"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const StudentDashboard: React.FC = observer(() => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);

  useEffect(() => {
    CoursesController.loadDashboardData();
  }, []);

  const isLoading = CoursesController.isLoading;
  const pendingCourses = CoursesController.pendingCourses;
  const approvedCourses = CoursesController.approvedCourses;
  const completedCourses = CoursesController.completedCourses;
  const availableCoursesCount = CoursesController.availableCoursesCount;
  const allEnrolledCourses = [...pendingCourses, ...approvedCourses, ...completedCourses];

  // Get a sample grade for completed courses (in a real app, this would come from the API)
  const getRandomGrade = () => {
    return Math.floor(Math.random() * 30) + 70; // Random grade between 70-100
  };

  const handleViewCourseDetails = (course: any) => {
    setSelectedCourse(course);
    setShowCourseDetails(true);
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex items-center h-10">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            My Courses Dashboard
          </div>
        </div>
        <div className="grid grid-cols-12 gap-5 mt-3.5">
          {/* Pending Enrollments */}
          <CourseCard
            title="Pending"
            subtitle="Awaiting Approval"
            icon="Clock"
            count={pendingCourses.length}
            status="Pending"
            loading={isLoading}
          />

          {/* Approved Courses */}
          <CourseCard
            title="Approved"
            subtitle="Current Courses"
            icon="CheckCircle"
            count={approvedCourses.length}
            status="Approved"
            loading={isLoading}
          />

          {/* Completed Courses */}
          <CourseCard
            title="Completed"
            subtitle="Finished Courses"
            icon="Award"
            count={completedCourses.length}
            status="Completed"
            loading={isLoading}
            grade={completedCourses.length > 0 ? getRandomGrade() : null}
          />

          {/* Available Courses */}
          <CourseCard
            title="Available"
            subtitle="Courses to Enroll"
            icon="BookOpen"
            count={availableCoursesCount}
            status=""
            loading={isLoading}
          />
        </div>

        <div className="flex items-center h-10 pt-5">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            My Courses
          </div>
        </div>
        <div className="mt-2 overflow-auto lg:overflow-visible">
          {isLoading ? (
            // Shimmer effect for loading state
            <div className="border-spacing-y-[10px] border-separate">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex w-full mb-3">
                  <div className="w-full h-16 box animate-pulse bg-slate-200 dark:bg-darkmode-400 rounded-[0.6rem]"></div>
                </div>
              ))}
            </div>
          ) : (
            <Table className="border-spacing-y-[10px] border-separate">
              <Table.Tbody>
                {allEnrolledCourses.length > 0 ? (
                  allEnrolledCourses.map((course) => {
                    const enrollment = CoursesController.getEnrollmentForCourse(course.id);
                    const status = enrollment?.statusString || "Unknown";
                    
                    return (
                      <Table.Tr key={course.id}>
                        <Table.Td className="box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] rounded-l-none rounded-r-none border-x-0 dark:bg-darkmode-600">
                          <div className="flex items-center">
                            <Lucide
                              icon="BookOpen"
                              className="w-6 h-6 text-theme-1 fill-primary/10 stroke-[0.8]"
                            />
                            <div className="ml-3.5">
                              <a href="#" onClick={(e) => {
                                e.preventDefault();
                                handleViewCourseDetails(course);
                              }} className="font-medium whitespace-nowrap">
                                {course.title}
                              </a>
                              <div className="mt-1 text-xs text-slate-500 whitespace-nowrap">
                                {course.credits} Credits
                              </div>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td className="w-60 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] rounded-l-none rounded-r-none border-x-0 dark:bg-darkmode-600">
                          <div className="mb-1 text-xs text-slate-500 whitespace-nowrap">
                            Instructor
                          </div>
                          <div className="flex items-center">
                            <Lucide
                              icon="User"
                              className="w-3.5 h-3.5 stroke-[1.7] text-slate-500 mr-1.5"
                            />
                            <div className="whitespace-nowrap">
                              {course.instructorName}
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td className="w-44 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] rounded-l-none rounded-r-none border-x-0 dark:bg-darkmode-600">
                          <div className="mb-1 text-xs text-slate-500 whitespace-nowrap">
                            Status
                          </div>
                          <div className={`flex items-center ${
                            status === "Approved" ? "text-success" : 
                            status === "Pending" ? "text-warning" : 
                            status === "Completed" ? "text-primary" : ""
                          }`}>
                            <Lucide
                              icon={
                                status === "Approved" ? "CheckCircle" : 
                                status === "Pending" ? "Clock" :
                                status === "Completed" ? "Award" : "Info"
                              }
                              className="w-3.5 h-3.5 stroke-[1.7]"
                            />
                            <div className="ml-1.5 whitespace-nowrap">
                              {status}
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td className="w-44 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] rounded-l-none rounded-r-none border-x-0 dark:bg-darkmode-600">
                          <div className="mb-1 text-xs text-slate-500 whitespace-nowrap">
                            Start Date
                          </div>
                          <div className="whitespace-nowrap">{course.startDate?.substring(0, 10) || "N/A"}</div>
                        </Table.Td>
                        <Table.Td className="w-44 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] rounded-l-none rounded-r-none border-x-0 dark:bg-darkmode-600">
                          <div className="mb-1 text-xs text-slate-500 whitespace-nowrap">
                            End Date
                          </div>
                          <div className="whitespace-nowrap">{course.endDate?.substring(0, 10) || "N/A"}</div>
                        </Table.Td>
                        <Table.Td className="w-20 relative py-0 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] rounded-l-none rounded-r-none border-x-0 dark:bg-darkmode-600">
                          <div className="flex items-center justify-center">
                            <Menu className="h-5">
                              <Menu.Button className="w-5 h-5 text-slate-500">
                                <Lucide
                                  icon="MoreVertical"
                                  className="w-5 h-5 stroke-slate-400/70 fill-slate-400/70"
                                />
                              </Menu.Button>
                              <Menu.Items className="w-40">
                                <Menu.Item onClick={() => handleViewCourseDetails(course)}>
                                  <Lucide
                                    icon="BookOpen"
                                    className="w-4 h-4 mr-2"
                                  />{" "}
                                  View Details
                                </Menu.Item>
                                <Menu.Item>
                                  <Lucide icon="MessageSquare" className="w-4 h-4 mr-2" />
                                  Contact Instructor
                                </Menu.Item>
                                <Menu.Item>
                                  <Lucide icon="FileText" className="w-4 h-4 mr-2" />
                                  View Syllabus
                                </Menu.Item>
                              </Menu.Items>
                            </Menu>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={6} className="text-center py-4 box shadow-[5px_3px_5px_#00000005] rounded-[0.6rem] dark:bg-darkmode-600">
                      <div className="flex flex-col items-center">
                        <Lucide icon="Search" className="w-16 h-16 text-slate-300 mb-2" />
                        <p className="text-slate-500">No courses found</p>
                        <Button variant="primary" className="mt-4">
                          Browse Available Courses
                        </Button>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          )}
        </div>

        {/* Course Details Modal */}
        {selectedCourse && (
          <CourseDetailsModal
            open={showCourseDetails}
            onClose={() => setShowCourseDetails(false)}
            course={selectedCourse}
          />
        )}
      </div>
    </div>
  );
});

export default StudentDashboard;
