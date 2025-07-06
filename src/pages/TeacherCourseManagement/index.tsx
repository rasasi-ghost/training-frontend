import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import { Menu, Popover, Dialog } from "@/components/Base/Headless";
import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect, FormTextarea, FormLabel } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { TeacherCourseController } from "@/controllers";
import clsx from "clsx";
import CourseDetailsModal from "./CourseDetailsModal";
import CourseFormModal from "./CourseFormModal";
import LectureFormModal from './LectureFormModal';
import EnrollmentManagementModal from "./EnrollmentManagementModal";
import {
  TeacherApprovalStatus,
  Course,
  Enrollment,
  Lecture
} from "@/services/TeacherService";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

// Extend the Course interface to include enrollmentCount
interface ExtendedCourse extends Course {
  enrollmentCount?: number;
}

function CourseStatCard({
  title,
  subtitle,
  icon,
  count,
  status,
  loading = false,
  colorClass = "text-primary"
}: {
  title: string;
  subtitle: string;
  icon: string;
  count: number;
  status?: string;
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
              {status && (
                <div className={`ml-2.5 px-2 py-0.5 rounded text-xs font-medium ${
                  status === "Active" ? "bg-success/20 text-success" : 
                  status === "Pending" ? "bg-warning/20 text-warning" : 
                  "bg-primary/20 text-primary"
                }`}>
                  {status}
                </div>
              )}
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

const TeacherDashboard: React.FC = observer(() => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<ExtendedCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ExtendedCourse | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<TeacherApprovalStatus>(TeacherApprovalStatus.Pending);
  const [approvalMessage, setApprovalMessage] = useState("");
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [showEnrollments, setShowEnrollments] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      console.log("Loading teacher dashboard data...");
      try {
        // Check approval status
        const approvalResult = await TeacherCourseController.checkApprovalStatus();
        if (approvalResult.success) {
          setApprovalStatus(approvalResult.status || TeacherApprovalStatus.Pending);
          setApprovalMessage(approvalResult.message || "");

          // If approved, load courses
          if (approvalResult.status === TeacherApprovalStatus.Approved) {
            const coursesResult = await TeacherCourseController.getTeacherCourses();
            if (coursesResult.success && coursesResult.courses) {
              setCourses(coursesResult.courses);
            }
          } else {
            // Show approval message dialog if not approved
            setShowApprovalMessage(true);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle course selection and load enrollments
  const handleCourseSelect = async (course: ExtendedCourse) => {
    setSelectedCourse(course);
    setShowCourseDetails(true);

    try {
      const result = await TeacherCourseController.getCourseEnrollments(course.id);
      if (result.success && result.enrollments) {
        setEnrollments(result.enrollments);
      }
    } catch (error) {
      console.error("Failed to load enrollments:", error);
    }
  };

  // Handle create new course
  const handleCreateCourse = () => {
    setIsEditMode(false);
    setSelectedCourse(null);
    setShowCourseForm(true);
  };

  // Handle edit course
  const handleEditCourse = (course: ExtendedCourse) => {
    setIsEditMode(true);
    setSelectedCourse(course);
    setShowCourseForm(true);
  };

  // Handle add lecture
  const handleAddLecture = (course: ExtendedCourse) => {
    setSelectedCourse(course);
    setIsEditMode(false);
    setShowLectureForm(true);
  };

  // Handle manage enrollments
  const handleManageEnrollments = async (course: ExtendedCourse) => {
    setSelectedCourse(course);
    try {
      const result = await TeacherCourseController.getCourseEnrollments(course.id);
      if (result.success && result.enrollments) {
        setEnrollments(result.enrollments);
        setShowEnrollments(true);
      }
    } catch (error) {
      console.error("Failed to load enrollments:", error);
    }
  };

  // Filter courses by search term
  const filteredCourses = searchTerm
    ? courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : courses;

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  // Course statistics
  const activeCourses = courses.filter(course => course.isActive).length;
  const inactiveCourses = courses.filter(course => !course.isActive).length;
  const totalEnrollments = courses.reduce((total, course) => {
    return total + (course.enrollmentCount || 0);
  }, 0);

  // If teacher is not approved, show message
  if (approvalStatus !== TeacherApprovalStatus.Approved && !loading && showApprovalMessage) {
    return (
      <Dialog
        open={showApprovalMessage}
        onClose={() => setShowApprovalMessage(false)}
        size="md"
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon={approvalStatus === TeacherApprovalStatus.Rejected ? "XCircle" : "Clock"}
              className={`w-16 h-16 mx-auto mt-3 ${approvalStatus === TeacherApprovalStatus.Rejected ? "text-danger" : "text-warning"}`}
            />
            <div className="mt-5 text-2xl">
              {approvalStatus === TeacherApprovalStatus.Rejected ? "Application Rejected" : "Approval Pending"}
            </div>
            <div className="mt-2 text-slate-500">
              {approvalMessage || "Your teacher account is currently not approved. Please contact the administrator for more information."}
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            {/* <Button
              type="button"
              variant="primary"
              onClick={() => navigate("/dashboard")}
              className="w-24"
            >
              Go to Dashboard
            </Button> */}
          </div>
        </Dialog.Panel>
      </Dialog>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            Teacher Dashboard
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="flex flex-col gap-8 mt-3.5">
          <div className="grid grid-cols-12 gap-5">
            <CourseStatCard
              title="Total Courses"
              subtitle="All Your Courses"
              icon="BookOpen"
              count={courses.length}
              loading={loading}
              colorClass="text-primary"
            />
            <CourseStatCard
              title="Active Courses"
              subtitle="Currently Running"
              icon="CheckCircle"
              count={activeCourses}
              status="Active"
              loading={loading}
              colorClass="text-success"
            />
            <CourseStatCard
              title="Inactive Courses"
              subtitle="Not Currently Active"
              icon="XCircle"
              count={inactiveCourses}
              loading={loading}
              colorClass="text-danger"
            />
        
          </div>
          <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
            <div className="text-base font-medium group-[.mode--light]:text-white">
              My Courses
            </div>
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
              <Button
                variant="primary"
                className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
                onClick={handleCreateCourse}
                disabled={loading || approvalStatus !== TeacherApprovalStatus.Approved}
              >
                <Lucide icon="PlusCircle" className="stroke-[1.3] w-4 h-4 mr-2" />{" "}
                Create New Course
              </Button>
            </div>
          </div>
          {/* Courses Table */}
          <div className="flex flex-col box box--stacked">

            <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
              <div>
                <div className="relative">
                  <Lucide
                    icon="Search"
                    className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
                  />
                  <FormInput
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:w-64 rounded-[0.5rem]"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
                <Menu>
                  <Menu.Button
                    as={Button}
                    variant="outline-secondary"
                    className="w-full sm:w-auto"
                  >
                    <Lucide
                      icon="Filter"
                      className="stroke-[1.3] w-4 h-4 mr-2"
                    />
                    Filter
                    <Lucide
                      icon="ChevronDown"
                      className="stroke-[1.3] w-4 h-4 ml-2"
                    />
                  </Menu.Button>
                  <Menu.Items className="w-40">
                    <Menu.Item onClick={() => setCourses([...courses].filter(course => course.isActive))}>
                      <Lucide icon="CheckCircle" className="w-4 h-4 mr-2" />{" "}
                      Active Only
                    </Menu.Item>
                    <Menu.Item onClick={() => setCourses([...courses].filter(course => !course.isActive))}>
                      <Lucide icon="XCircle" className="w-4 h-4 mr-2" />
                      Inactive Only
                    </Menu.Item>
                    <Menu.Item onClick={() => TeacherCourseController.getTeacherCourses().then(res => {
                      if (res.success && res.courses) setCourses(res.courses);
                    })}>
                      <Lucide icon="RefreshCw" className="w-4 h-4 mr-2" />
                      Reset Filters
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            </div>

            {loading ? (
              // Shimmer loading effect for table
              <div className="overflow-auto xl:overflow-visible">
                <div className="min-w-full">
                  <div className="border-b border-slate-200/60 bg-slate-50 p-4">
                    <div className="grid grid-cols-6 gap-4">
                      <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="border-b border-slate-200/60 p-4">
                      <div className="grid grid-cols-6 gap-4">
                        <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-auto xl:overflow-visible">
                <Table className="border-b border-slate-200/60">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        <FormCheck.Input type="checkbox" />
                      </Table.Td>
                      <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        Course Name
                      </Table.Td>
                      <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        Enrollment
                      </Table.Td>
                      <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        Start Date
                      </Table.Td>
                      <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        End Date
                      </Table.Td>
                      <Table.Td className="py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        Status
                      </Table.Td>
                      <Table.Td className="w-20 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        Action
                      </Table.Td>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {currentCourses.length > 0 ? (
                      currentCourses.map((course) => (
                        <Table.Tr key={course.id} className="[&_td]:last:border-b-0">
                          <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                            <FormCheck.Input type="checkbox" />
                          </Table.Td>
                          <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                            <div className="flex items-center">
                              <div className="w-9 h-9 image-fit zoom-in rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                                <Lucide
                                  icon="BookOpen"
                                  className="w-5 h-5 text-primary"
                                />
                              </div>
                              <div className="ml-3.5">
                                <a
                                  href="#"
                                  className="font-medium whitespace-nowrap"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCourseSelect(course);
                                  }}
                                >
                                  {course.title}
                                </a>
                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                  {course.description.length > 50 ? course.description.substring(0, 50) + "..." : course.description}
                                </div>
                              </div>
                            </div>
                          </Table.Td>
                          <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                            <div className="font-medium whitespace-nowrap">
                              {course.enrollmentCount || 0} / {course.maxEnrollment}
                            </div>
                            <div className="mt-1 flex h-1 border rounded-sm bg-slate-50 dark:bg-darkmode-400">
                              <div
                                className={clsx([
                                  "first:rounded-l-sm last:rounded-r-sm border border-primary/20 -m-px bg-primary/40",
                                  course.maxEnrollment > 0
                                    ? `w-[${Math.min(((course.enrollmentCount || 0) / course.maxEnrollment) * 100, 100)}%]`
                                    : "w-0"
                                ])}
                              ></div>
                            </div>
                          </Table.Td>
                          <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                            <div className="font-medium whitespace-nowrap">
                              {new Date(course.startDate).toLocaleDateString()}
                            </div>
                          </Table.Td>
                          <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                            <div className="font-medium whitespace-nowrap">
                              {new Date(course.endDate).toLocaleDateString()}
                            </div>
                          </Table.Td>
                          <Table.Td className="py-4 text-center border-dashed dark:bg-darkmode-600">
                            <div
                              className={clsx([
                                "flex items-center justify-center",
                                course.isActive ? "text-success" : "text-danger",
                              ])}
                            >
                              <Lucide
                                icon={course.isActive ? "CheckCircle" : "XCircle"}
                                className="w-3.5 h-3.5 stroke-[1.7]"
                              />
                              <div className="ml-1.5 whitespace-nowrap">
                                {course.isActive ? "Active" : "Inactive"}
                              </div>
                            </div>
                          </Table.Td>
                          <Table.Td className="relative py-4 border-dashed dark:bg-darkmode-600">
                            <div className="flex items-center justify-center">
                              <Menu className="h-5">
                                <Menu.Button className="w-5 h-5 text-slate-500">
                                  <Lucide
                                    icon="MoreVertical"
                                    className="w-5 h-5 stroke-slate-400/70 fill-slate-400/70"
                                  />
                                </Menu.Button>
                                <Menu.Items className="w-40">
                                  <Menu.Item onClick={() => handleCourseSelect(course)}>
                                    <Lucide
                                      icon="Eye"
                                      className="w-4 h-4 mr-2"
                                    />{" "}
                                    View Details
                                  </Menu.Item>
                                    <Menu.Item onClick={() => handleEditCourse(course)}>
                                    <Lucide
                                      icon="Pencil"
                                      className="w-4 h-4 mr-2"
                                    />{" "}
                                    Edit Course
                                    </Menu.Item>
                                  <Menu.Item onClick={() => handleAddLecture(course)}>
                                    <Lucide
                                      icon="Plus"
                                      className="w-4 h-4 mr-2"
                                    />{" "}
                                    Add Lecture
                                  </Menu.Item>
                                  <Menu.Item onClick={() => handleManageEnrollments(course)}>
                                    <Lucide
                                      icon="Users"
                                      className="w-4 h-4 mr-2"
                                    />{" "}
                                    Manage Enrollments
                                  </Menu.Item>
                                  <Menu.Item onClick={async () => {
                                    await TeacherCourseController.updateCourse(course.id, { isActive: !course.isActive });
                                    const updatedCourses = courses.map(c =>
                                      c.id === course.id ? { ...c, isActive: !c.isActive } : c
                                    );
                                    setCourses(updatedCourses);
                                  }}>
                                    <Lucide
                                      icon={course.isActive ? "XCircle" : "CheckCircle"}
                                      className="w-4 h-4 mr-2"
                                    />
                                    {course.isActive ? "Deactivate" : "Activate"}
                                  </Menu.Item>
                                </Menu.Items>
                              </Menu>
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      ))
                    ) : (
                      <Table.Tr>
                        <Table.Td colSpan={7} className="text-center py-4">
                          <div className="flex flex-col items-center justify-center py-4">
                            <Lucide
                              icon="Search"
                              className="w-16 h-16 text-slate-300"
                            />
                            <div className="mt-2 text-slate-500">
                              {searchTerm ? "No courses match your search" : "No courses found"}
                            </div>
                            <Button
                              variant="outline-primary"
                              className="mt-4"
                              onClick={handleCreateCourse}
                            >
                              <Lucide icon="PlusCircle" className="w-4 h-4 mr-2" />
                              Create New Course
                            </Button>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredCourses.length > 0 && (
              <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
                <Pagination className="flex-1 w-full mr-auto sm:w-auto">
                  <Pagination.Link onClick={() => currentPage > 1 && setCurrentPage(1)}>
                    <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                  </Pagination.Link>
                  <Pagination.Link onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                    <Lucide icon="ChevronLeft" className="w-4 h-4" />
                  </Pagination.Link>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <Pagination.Link
                          key={pageNumber}
                          active={currentPage === pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Link>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <Pagination.Link key={pageNumber}>...</Pagination.Link>;
                    }
                    return null;
                  })}
                  <Pagination.Link onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
                    <Lucide icon="ChevronRight" className="w-4 h-4" />
                  </Pagination.Link>
                  <Pagination.Link onClick={() => currentPage < totalPages && setCurrentPage(totalPages)}>
                    <Lucide icon="ChevronsRight" className="w-4 h-4" />
                  </Pagination.Link>
                </Pagination>
                <FormSelect
                  className="sm:w-20 rounded-[0.5rem]"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </FormSelect>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          open={showCourseDetails}
          onClose={() => setShowCourseDetails(false)}
          course={selectedCourse}
          onEdit={() => {
            setShowCourseDetails(false);
            handleEditCourse(selectedCourse);
          }}
          onAddLecture={() => {
            setShowCourseDetails(false);
            handleAddLecture(selectedCourse);
          }}
          onManageEnrollments={() => {
            setShowCourseDetails(false);
            handleManageEnrollments(selectedCourse);
          }}
        />
      )}

      {/* Course Form Modal */}
      <CourseFormModal
        open={showCourseForm}
        onClose={() => setShowCourseForm(false)}
        course={isEditMode ? selectedCourse : null}
        isEdit={isEditMode}
        onSuccess={(newCourse: any) => {
          setShowCourseForm(false);
          if (isEditMode) {
            setCourses(
              courses.map(c => c.id === newCourse.id ? newCourse : c)
            );
          } else {
            setCourses([...courses, newCourse]);
          }
          // Refresh courses from API
          TeacherCourseController.getTeacherCourses().then(res => {
            if (res.success && res.courses) setCourses(res.courses);
          });
        }}
      />

      {/* Lecture Form Modal */}
      {selectedCourse && (
        <LectureFormModal
          open={showLectureForm}
          onClose={() => setShowLectureForm(false)}
          courseId={selectedCourse.id}
          onSuccess={() => {
            setShowLectureForm(false);
            // Refresh course details
            TeacherCourseController.getCourseDetails(selectedCourse.id).then(res => {
              if (res.success && res.course) {
                setSelectedCourse(res.course);
                const updatedCourses = courses.map(c =>
                  c.id === res.course?.id ? res.course : c
                );
                setCourses(updatedCourses);
              }
            });
          }}
        />
      )}

      {/* Enrollment Management Modal */}
      {selectedCourse && (
        <EnrollmentManagementModal
          open={showEnrollments}
          onClose={() => setShowEnrollments(false)}
          courseId={selectedCourse.id}
          enrollments={enrollments}
          onSuccess={() => {
            // Refresh enrollments
            TeacherCourseController.getCourseEnrollments(selectedCourse.id).then(res => {
              if (res.success && res.enrollments) {
                setEnrollments(res.enrollments);
              }
            });
          }}
        />
      )}
    </div>
  );
});

export default TeacherDashboard;
