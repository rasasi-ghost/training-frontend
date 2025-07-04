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

import _ from "lodash";
import users from "@/fakers/users";

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
  const [showEnrollConfirmation, setShowEnrollConfirmation] = useState(false);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  useEffect(() => {
    CoursesController.loadDashboardData();
  }, []);

  const isLoading = CoursesController.isLoading;
  const pendingCourses = CoursesController.pendingCourses;
  const approvedCourses = CoursesController.approvedCourses;
  const completedCourses = CoursesController.completedCourses;
  const availableCoursesCount = CoursesController.availableCoursesCount;
  const allEnrolledCourses = [...pendingCourses, ...approvedCourses, ...completedCourses];

  const getRandomGrade = () => {
    return Math.floor(Math.random() * 30) + 70; // Random grade between 70-100
  };

  const handleViewCourseDetails = (course: any) => {
    setSelectedCourse(course);
    setShowCourseDetails(true);
  };

  const handleEnrollCourse = (courseId: string) => {
    setEnrollingCourseId(courseId);
    setShowEnrollConfirmation(true);
  };

  const submitEnrollment = async () => {
    if (!enrollingCourseId) return;

    setIsEnrolling(true);
    try {
      const success = await CoursesController.enrollInCourse(enrollingCourseId);
      if (success) {
        setEnrollmentSuccess(true);
        setTimeout(() => {
          setShowEnrollConfirmation(false);
          setEnrollmentSuccess(false);
          setEnrollingCourseId(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Enrollment failed", error);
    } finally {
      setIsEnrolling(false);
    }
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
          <CourseCard
            title="Pending"
            subtitle="Awaiting Approval"
            icon="Clock"
            count={pendingCourses.length}
            status="Pending"
            loading={isLoading}
          />
          <CourseCard
            title="Approved"
            subtitle="Current Courses"
            icon="CheckCircle"
            count={approvedCourses.length}
            status="Approved"
            loading={isLoading}
          />
          <CourseCard
            title="Completed"
            subtitle="Finished Courses"
            icon="Award"
            count={completedCourses.length}
            status="Completed"
            loading={isLoading}
            grade={completedCourses.length > 0 ? getRandomGrade() : null}
          />
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

        <div className="flex items-center h-10 pt-5 mt-5">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            Available Courses
          </div>
        </div>

        <div id="mynewcomponent" className="grid grid-cols-12 gap-y-10 gap-x-6 mt-3.5">
          {isLoading ? (
            [...Array(6)].map((_, index) => (
              <div key={index} className="flex flex-col col-span-12 md:col-span-6 xl:col-span-4 box box--stacked animate-pulse">
                <div className="h-40 bg-slate-200 dark:bg-darkmode-400 rounded-t-[0.6rem]"></div>
                <div className="p-5">
                  <div className="h-6 bg-slate-200 dark:bg-darkmode-400 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-darkmode-400 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-darkmode-400 rounded mb-4 w-2/3"></div>
                  <div className="h-8 bg-slate-200 dark:bg-darkmode-400 rounded w-1/3 ml-auto"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {CoursesController.availableCourses.map((course) => {
                const isEnrolled = allEnrolledCourses.some(c => c.id === course.id);
                return (
                  <div
                    key={course.id}
                    className="flex flex-col col-span-12 md:col-span-6 xl:col-span-4 box box--stacked"
                  >
                    <div className="relative h-40 bg-slate-200 dark:bg-darkmode-600 rounded-t-[0.6rem]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lucide
                          icon="BookOpen"
                          className="w-16 h-16 text-primary/30"
                        />
                      </div>
                      {isEnrolled && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-md bg-success/20 text-success">
                            Enrolled
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col p-5">
                      <div className="text-lg font-medium text-primary">
                        {course.title}
                      </div>
                      <div className="flex items-center mt-2">
                        <Lucide
                          icon="User"
                          className="w-4 h-4 mr-1.5 text-slate-500"
                        />
                        <div className="text-slate-600">
                          {course.instructorName}
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <Lucide
                          icon="Calendar"
                          className="w-4 h-4 mr-1.5 text-slate-500"
                        />
                        <div className="text-slate-600">
                          {course.startDate?.substring(0, 10) || "N/A"}
                        </div>
                      </div>
                      <div className="flex items-center mt-1 mb-4">
                        <Lucide
                          icon="Award"
                          className="w-4 h-4 mr-1.5 text-slate-500"
                        />
                        <div className="text-slate-600">
                          {course.credits} Credits
                        </div>
                      </div>
                      {isEnrolled ? (
                        <Button
                          variant="primary"
                          className="w-full mt-auto"
                          onClick={() => handleViewCourseDetails(course)}
                        >
                          View Course
                        </Button>
                      ) : (
                        <Button
                          variant="outline-primary"
                          className="w-full mt-auto"
                          onClick={() => handleEnrollCourse(course.id)}
                        >
                          Enroll in Course
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}

              {CoursesController.availableCourses.length === 0 && !isLoading && (
                <div className="col-span-12 flex flex-col items-center justify-center p-10 box box--stacked">
                  <Lucide
                    icon="Search"
                    className="w-16 h-16 text-slate-300 mb-2"
                  />
                  <p className="text-slate-500 text-lg">No available courses found</p>
                </div>
              )}
            </>
          )}
        </div>

        {selectedCourse && (
          <CourseDetailsModal
            open={showCourseDetails}
            onClose={() => setShowCourseDetails(false)}
            course={selectedCourse}
          />
        )}

        <Dialog
          open={showEnrollConfirmation}
          onClose={() => {
            if (!isEnrolling && !enrollmentSuccess) {
              setShowEnrollConfirmation(false);
              setEnrollingCourseId(null);
            }
          }}
        >
          <Dialog.Panel>
            {enrollmentSuccess ? (
              <div className="p-5 text-center">
                <Lucide
                  icon="CheckCircle"
                  className="w-16 h-16 mx-auto mt-3 text-success"
                />
                <div className="mt-5 text-2xl">Enrollment Successful!</div>
                <div className="mt-2 text-slate-500">
                  Your enrollment request has been submitted and is pending approval.
                </div>
              </div>
            ) : (
              <>
                <div className="p-5 text-center">
                  <Lucide
                    icon="HelpCircle"
                    className="w-16 h-16 mx-auto mt-3 text-primary"
                  />
                  <div className="mt-5 text-2xl">Confirm Enrollment</div>
                  <div className="mt-2 text-slate-500">
                    Are you sure you want to enroll in this course? This action will submit an enrollment request that requires approval.
                  </div>
                </div>
                <div className="px-5 pb-8 text-center">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => {
                      setShowEnrollConfirmation(false);
                      setEnrollingCourseId(null);
                    }}
                    className="w-24 mr-2"
                    disabled={isEnrolling}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={submitEnrollment}
                    className="w-24"
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? (
                      <LoadingIcon icon="oval" className="w-5 h-5" />
                    ) : (
                      "Enroll"
                    )}
                  </Button>
                </div>
              </>
            )}
          </Dialog.Panel>
        </Dialog>
      </div>
    </div>
  );
});

export default StudentDashboard;
