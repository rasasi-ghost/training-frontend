import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import { Menu, Popover } from "@/components/Base/Headless";
import Pagination from "@/components/Base/Pagination";
import { FormInput, FormSelect, FormLabel } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { TeacherCourseController } from "@/controllers";
import { Course, Enrollment } from "@/services/TeacherService";
import _ from "lodash";
import EnrollmentActionModal from "./EnrollmentActionModal";
import EnrollmentChart from "./EnrollmentChart";
import StatusBadge from  "./StatusBadge";
import NoDataDisplay from "./NoDataDisplay";
import ConfirmationModal from "../TeacherEnrollmentManagement/ConfirmationModal";

const EnrollmentManagement: React.FC = observer(() => {
  // State for courses and enrollments
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState({
    title: "",
    message: "",
    icon: "CheckCircle" as const,
    iconColor: "text-success"
  });

  // Statistics data
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    pendingApprovals: 0,
    approvedEnrollments: 0,
    completedEnrollments: 0,
    rejectedEnrollments: 0
  });

  // Load courses on component mount
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const result = await TeacherCourseController.getTeacherCourses();
        if (result.success && result.courses) {
          setCourses(result.courses);
          // If courses are available, select the first one by default
          if (result.courses.length > 0) {
            setSelectedCourse(result.courses[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Load enrollments when selected course changes
  useEffect(() => {
    if (selectedCourse) {
      loadEnrollments(selectedCourse.id);
    }
  }, [selectedCourse]);

  // Update filtered enrollments when enrollments, search term, or status filter changes
  useEffect(() => {
    filterEnrollments();
  }, [enrollments, searchTerm, statusFilter]);

  // Calculate statistics when enrollments change
  useEffect(() => {
    calculateStats();
  }, [enrollments]);

  // Load enrollments for a specific course
  const loadEnrollments = async (courseId: string) => {
    setLoading(true);
    try {
      const result = await TeacherCourseController.getCourseEnrollments(courseId);
      if (result.success && result.enrollments) {
        setEnrollments(result.enrollments);
        setFilteredEnrollments(result.enrollments);
      }
    } catch (error) {
      console.error("Failed to load enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter enrollments based on search term and status filter
  const filterEnrollments = () => {
    let filtered = [...enrollments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(enrollment => 
        enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== null) {
      filtered = filtered.filter(enrollment => enrollment.status === statusFilter);
    }

    setFilteredEnrollments(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Calculate enrollment statistics
  const calculateStats = () => {
    const pendingApprovals = enrollments.filter(e => e.status === 0).length;
    const approvedEnrollments = enrollments.filter(e => e.status === 1).length;
    const completedEnrollments = enrollments.filter(e => e.status === 2).length;
    const rejectedEnrollments = enrollments.filter(e => e.status === 3).length;

    setStats({
      totalEnrollments: enrollments.length,
      pendingApprovals,
      approvedEnrollments,
      completedEnrollments,
      rejectedEnrollments
    });
  };

  // Handle course selection
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    const course = courses.find(c => c.id === courseId) || null;
    setSelectedCourse(course);
  };

  // Handle enrollment action
  const handleEnrollmentAction = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowActionModal(true);
  };

  // Handle action success
  const handleActionSuccess = (message: string) => {
    setShowActionModal(false);
    
    // Show confirmation message
    setConfirmationMessage({
      title: "Action Successful",
      message,
      icon: "CheckCircle",
      iconColor: "text-success"
    });
    setShowConfirmation(true);
    
    // Reload enrollments for the current course
    if (selectedCourse) {
      loadEnrollments(selectedCourse.id);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnrollments = filteredEnrollments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);

  // Stat Card Component
  const StatCard = ({ title, count, icon, color }: { title: string, count: number, icon: string, color: string }) => (
    <div className="col-span-6 sm:col-span-3 xl:col-span-3">
      <div className="p-5 box box--stacked">
        <div className="flex items-center">
          <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}>
            <Lucide icon={icon} className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <div className="text-slate-500">{title}</div>
            <div className="text-3xl font-medium mt-1">{count}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div className="text-base font-medium">
            Enrollment Management
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
            <FormSelect
              value={selectedCourse?.id || ""}
              onChange={handleCourseChange}
              className="rounded-[0.5rem]"
              disabled={loading || courses.length === 0}
            >
              {courses.length === 0 ? (
                <option value="">No courses available</option>
              ) : (
                <>
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </>
              )}
            </FormSelect>
          </div>
        </div>

        {/* Statistics Cards */}
        {selectedCourse && (
          <div className="grid grid-cols-12 gap-5 mt-5">
            <StatCard 
              title="Total Enrollments" 
              count={stats.totalEnrollments} 
              icon="Users" 
              color="bg-primary" 
            />
            <StatCard 
              title="Pending Approvals" 
              count={stats.pendingApprovals} 
              icon="Clock" 
              color="bg-warning" 
            />
            <StatCard 
              title="Active Students" 
              count={stats.approvedEnrollments} 
              icon="UserCheck" 
              color="bg-success" 
            />
            <StatCard 
              title="Course Completed" 
              count={stats.completedEnrollments} 
              icon="Award" 
              color="bg-info" 
            />
          </div>
        )}

        {/* Enrollment Chart */}
        {selectedCourse && enrollments.length > 0 && (
          <div className="mt-5 p-5 box box--stacked">
            <div className="flex flex-col pb-5 mb-5 border-b border-dashed sm:items-center sm:flex-row border-slate-300/70">
              <div className="text-lg font-medium">
                Enrollment Statistics
              </div>
              <div className="mt-3 sm:ml-auto sm:mt-0">
                <div className="text-slate-500">
                  Course: <span className="font-medium text-primary">{selectedCourse.title}</span>
                </div>
              </div>
            </div>
            <EnrollmentChart 
              pending={stats.pendingApprovals}
              approved={stats.approvedEnrollments}
              completed={stats.completedEnrollments}
              rejected={stats.rejectedEnrollments}
            />
          </div>
        )}

        {/* Enrollments Table */}
        <div className="mt-5 flex flex-col box box--stacked">
          <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
            <div>
              <div className="relative">
                <Lucide
                  icon="Search"
                  className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
                />
                <FormInput
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:w-64 rounded-[0.5rem]"
                  disabled={!selectedCourse || loading}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
              <FormSelect
                value={statusFilter === null ? "" : statusFilter.toString()}
                onChange={(e) => setStatusFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full sm:w-40 rounded-[0.5rem]"
                disabled={!selectedCourse || loading}
              >
                <option value="">All Statuses</option>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Completed</option>
                <option value="3">Rejected</option>
              </FormSelect>
              <Menu>
                <Menu.Button
                  as={Button}
                  variant="outline-secondary"
                  className="w-full sm:w-auto"
                  disabled={!selectedCourse || loading}
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
                  <Menu.Item onClick={() => setStatusFilter(null)}>
                    <Lucide icon="List" className="w-4 h-4 mr-2" />
                    All Enrollments
                  </Menu.Item>
                  <Menu.Item onClick={() => setStatusFilter(0)}>
                    <Lucide icon="Clock" className="w-4 h-4 mr-2 text-warning" />
                    Pending Only
                  </Menu.Item>
                  <Menu.Item onClick={() => setStatusFilter(1)}>
                    <Lucide icon="CheckCircle" className="w-4 h-4 mr-2 text-success" />
                    Approved Only
                  </Menu.Item>
                  <Menu.Item onClick={() => setStatusFilter(2)}>
                    <Lucide icon="Award" className="w-4 h-4 mr-2 text-primary" />
                    Completed Only
                  </Menu.Item>
                  <Menu.Item onClick={() => setStatusFilter(3)}>
                    <Lucide icon="XCircle" className="w-4 h-4 mr-2 text-danger" />
                    Rejected Only
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          </div>

          {loading ? (
            // Loading skeleton
            <div className="overflow-auto xl:overflow-visible">
              <div className="border-b border-slate-200/60 bg-slate-50 p-4">
                <div className="grid grid-cols-5 gap-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-5 bg-slate-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="border-b border-slate-200/60 p-4">
                  <div className="grid grid-cols-5 gap-4">
                    {[...Array(5)].map((_, idx) => (
                      <div key={idx} className="h-5 bg-slate-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : !selectedCourse ? (
            <NoDataDisplay 
              icon="BookOpen"
              title="No Course Selected"
              message="Please select a course to view enrollment data"
            />
          ) : enrollments.length === 0 ? (
            <NoDataDisplay 
              icon="Users"
              title="No Enrollments Found"
              message="This course doesn't have any enrollments yet"
            />
          ) : filteredEnrollments.length === 0 ? (
            <NoDataDisplay 
              icon="Search"
              title="No Results Found"
              message="No enrollments match your search criteria"
            />
          ) : (
            <div className="overflow-auto xl:overflow-visible">
              <Table className="border-b border-slate-200/60">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500">
                      Student Name
                    </Table.Td>
                    <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500">
                      Enrollment Date
                    </Table.Td>
                    <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500">
                      Status
                    </Table.Td>
                    <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500">
                      Grade
                    </Table.Td>
                    <Table.Td className="py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500">
                      Actions
                    </Table.Td>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {currentEnrollments.map((enrollment) => (
                    <Table.Tr key={enrollment.id} className="[&_td]:last:border-b-0">
                      <Table.Td className="py-4 border-dashed">
                        <div className="flex items-center">
                          <div className="w-9 h-9 image-fit zoom-in rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                            <Lucide
                              icon="User"
                              className="w-5 h-5 text-primary"
                            />
                          </div>
                          <div className="ml-3.5">
                            <a
                              href="#"
                              className="font-medium whitespace-nowrap"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEnrollmentAction(enrollment);
                              }}
                            >
                              {enrollment.studentName}
                            </a>
                            <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              Student ID: {enrollment.studentId.substring(0, 8)}
                            </div>
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        {formatDate(enrollment.enrollmentDate)}
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        <StatusBadge status={enrollment.status} />
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        {enrollment.grade || (
                          <span className="text-slate-400">Not graded</span>
                        )}
                      </Table.Td>
                      <Table.Td className="py-4 text-center border-dashed">
                        <div className="flex items-center justify-center">
                          <Menu className="h-5">
                            <Menu.Button className="w-5 h-5 text-slate-500">
                              <Lucide
                                icon="MoreVertical"
                                className="w-5 h-5 stroke-slate-400/70 fill-slate-400/70"
                              />
                            </Menu.Button>
                            <Menu.Items className="w-40">
                              <Menu.Item onClick={() => handleEnrollmentAction(enrollment)}>
                                <Lucide
                                  icon="Pencil"
                                  className="w-4 h-4 mr-2"
                                />{" "}
                                Manage Enrollment
                              </Menu.Item>
                              {enrollment.status === 0 && (
                                <>
                                  <Menu.Item onClick={async () => {
                                    await TeacherCourseController.updateEnrollmentStatus(enrollment.id, 1);
                                    handleActionSuccess(`Approved ${enrollment.studentName}'s enrollment`);
                                  }}>
                                    <Lucide
                                      icon="CheckCircle"
                                      className="w-4 h-4 mr-2 text-success"
                                    />{" "}
                                    Approve
                                  </Menu.Item>
                                  <Menu.Item onClick={async () => {
                                    await TeacherCourseController.updateEnrollmentStatus(enrollment.id, 3);
                                    handleActionSuccess(`Rejected ${enrollment.studentName}'s enrollment`);
                                  }}>
                                    <Lucide
                                      icon="XCircle"
                                      className="w-4 h-4 mr-2 text-danger"
                                    />{" "}
                                    Reject
                                  </Menu.Item>
                                </>
                              )}
                              {enrollment.status === 1 && (
                                <Menu.Item onClick={async () => {
                                  await TeacherCourseController.updateEnrollmentStatus(enrollment.id, 2);
                                  handleActionSuccess(`Marked ${enrollment.studentName}'s course as completed`);
                                }}>
                                  <Lucide
                                    icon="Award"
                                    className="w-4 h-4 mr-2 text-primary"
                                  />{" "}
                                  Mark as Completed
                                </Menu.Item>
                              )}
                            </Menu.Items>
                          </Menu>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {filteredEnrollments.length > 0 && (
            <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
              <Pagination className="flex-1 w-full mr-auto sm:w-auto">
                <Pagination.Link 
                  onClick={() => setCurrentPage(1)}
                //   disabled={currentPage === 1}
                >
                  <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                </Pagination.Link>
                <Pagination.Link 
                  onClick={() => setCurrentPage(currentPage - 1)}
                //   disabled={currentPage === 1}
                >
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
                <Pagination.Link 
                  onClick={() => setCurrentPage(currentPage + 1)}
                //   disabled={currentPage === totalPages}
                >
                  <Lucide icon="ChevronRight" className="w-4 h-4" />
                </Pagination.Link>
                <Pagination.Link 
                  onClick={() => setCurrentPage(totalPages)}
                //   disabled={currentPage === totalPages}
                >
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

      {/* Enrollment Action Modal */}
      {selectedEnrollment && (
        <EnrollmentActionModal
          open={showActionModal}
          onClose={() => setShowActionModal(false)}
          enrollment={selectedEnrollment}
          onSuccess={handleActionSuccess}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title={confirmationMessage.title}
        message={confirmationMessage.message}
        icon={confirmationMessage.icon}
        iconColor={confirmationMessage.iconColor}
      />
    </div>
  );
});

export default EnrollmentManagement;
