import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { useStore } from "@/state/MobxStoreProvider";
import clsx from "clsx";

interface Course {
  id: string;
  title: string;
  description: string;
  teacherName: string;
  teacherId: string;
  enrollmentCount: number;
  maxEnrollment: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

const CourseManagementTab: React.FC = observer(() => {
  const { adminUsecasesStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  
  // Load courses
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        // In a real application, we would fetch from API
        // await adminUsecasesStore.fetchAllCourses();
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockCourses: Course[] = [
            {
              id: "1",
              title: "Introduction to Computer Science",
              description: "Basic concepts of computer science",
              teacherName: "Dr. John Smith",
              teacherId: "t1",
              enrollmentCount: 45,
              maxEnrollment: 50,
              isActive: true,
              startDate: "2023-01-15",
              endDate: "2023-05-30",
              createdAt: "2022-12-01"
            },
            {
              id: "2",
              title: "Advanced Programming",
              description: "Advanced programming techniques",
              teacherName: "Prof. Jane Doe",
              teacherId: "t2",
              enrollmentCount: 30,
              maxEnrollment: 40,
              isActive: true,
              startDate: "2023-02-01",
              endDate: "2023-06-15",
              createdAt: "2022-12-15"
            },
            {
              id: "3",
              title: "Data Structures",
              description: "Study of data structures and algorithms",
              teacherName: "Dr. Robert Johnson",
              teacherId: "t3",
              enrollmentCount: 35,
              maxEnrollment: 35,
              isActive: false,
              startDate: "2023-01-10",
              endDate: "2023-05-20",
              createdAt: "2022-12-10"
            },
            {
              id: "4",
              title: "Database Management Systems",
              description: "Design and implementation of database systems",
              teacherName: "Dr. Sarah Williams",
              teacherId: "t4",
              enrollmentCount: 28,
              maxEnrollment: 40,
              isActive: true,
              startDate: "2023-01-20",
              endDate: "2023-06-05",
              createdAt: "2022-12-20"
            },
            {
              id: "5",
              title: "Operating Systems",
              description: "Principles of operating systems",
              teacherName: "Prof. Michael Brown",
              teacherId: "t5",
              enrollmentCount: 38,
              maxEnrollment: 45,
              isActive: true,
              startDate: "2023-02-10",
              endDate: "2023-06-25",
              createdAt: "2023-01-05"
            }
          ];
          setCourses(mockCourses);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Failed to load courses:", error);
        setLoading(false);
      }
    };
    
    loadCourses();
  }, []);
  
  // Handle course status toggle
  const handleToggleCourseStatus = (courseId: string) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? { ...course, isActive: !course.isActive }
          : course
      )
    );
  };
  
  // Filter courses by search term and status
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && course.isActive) ||
      (statusFilter === "inactive" && !course.isActive);
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  
  // Course statistics
  const activeCourses = courses.filter(course => course.isActive).length;
  const inactiveCourses = courses.filter(course => !course.isActive).length;
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollmentCount, 0);
  const averageEnrollment = courses.length > 0
    ? Math.round(totalEnrollments / courses.length)
    : 0;
  
  return (
    <div className="flex flex-col gap-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-12 gap-5">
        <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] p-0.5 border border-primary/80 rounded-full bg-slate-50 cursor-pointer">
              <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70">
                <Lucide icon="BookOpen" className="w-full h-full text-primary" />
              </div>
            </div>
            <div className="ml-4">
              <div className="-mt-0.5 text-lg font-medium text-primary">
                Total Courses
              </div>
              <div className="mt-0.5 text-slate-500">All Courses</div>
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
                  <div className="text-xl font-medium leading-tight">{courses.length}</div>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Available Courses
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] p-0.5 border border-success/80 rounded-full bg-slate-50 cursor-pointer">
              <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70">
                <Lucide icon="CheckCircle" className="w-full h-full text-success" />
              </div>
            </div>
            <div className="ml-4">
              <div className="-mt-0.5 text-lg font-medium text-success">
                Active Courses
              </div>
              <div className="mt-0.5 text-slate-500">Currently Running</div>
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
                  <div className="text-xl font-medium leading-tight">{activeCourses}</div>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Active Courses
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] p-0.5 border border-danger/80 rounded-full bg-slate-50 cursor-pointer">
              <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70">
                <Lucide icon="XCircle" className="w-full h-full text-danger" />
              </div>
            </div>
            <div className="ml-4">
              <div className="-mt-0.5 text-lg font-medium text-danger">
                Inactive Courses
              </div>
              <div className="mt-0.5 text-slate-500">Not Running</div>
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
                  <div className="text-xl font-medium leading-tight">{inactiveCourses}</div>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Inactive Courses
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] p-0.5 border border-warning/80 rounded-full bg-slate-50 cursor-pointer">
              <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70">
                <Lucide icon="Users" className="w-full h-full text-warning" />
              </div>
            </div>
            <div className="ml-4">
              <div className="-mt-0.5 text-lg font-medium text-warning">
                Total Enrollments
              </div>
              <div className="mt-0.5 text-slate-500">All Students</div>
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
                  <div className="text-xl font-medium leading-tight">{totalEnrollments}</div>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Enrolled Students
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Course Table */}
      <div className="flex flex-col box box--stacked">
        <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
          <div className="flex gap-2">
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
            <FormSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-40 rounded-[0.5rem]"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </FormSelect>
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
            <Button
              variant="outline-secondary"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                // In a real app, you would refresh the data
                // adminUsecasesStore.fetchAllCourses();
              }}
            >
              <Lucide icon="RefreshCw" className="w-4 h-4 mr-2" />
              Refresh
            </Button>
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
                    Course
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                    Teacher
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                    Enrollment
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                    Date Range
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
                              onClick={(e) => e.preventDefault()}
                            >
                              {course.title}
                            </a>
                            <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {course.description.length > 50 
                                ? course.description.substring(0, 50) + "..." 
                                : course.description}
                            </div>
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                        <div className="font-medium whitespace-nowrap">
                          {course.teacherName}
                        </div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                        <div className="font-medium whitespace-nowrap">
                          {course.enrollmentCount} / {course.maxEnrollment}
                        </div>
                        <div className="mt-1 flex h-1 border rounded-sm bg-slate-50 dark:bg-darkmode-400">
                          <div
                            className={clsx([
                              "first:rounded-l-sm last:rounded-r-sm border border-primary/20 -m-px bg-primary/40",
                            ])}
                            style={{ width: `${Math.min((course.enrollmentCount / course.maxEnrollment) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                        <div className="font-medium whitespace-nowrap">
                          {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
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
                              <Menu.Item>
                                <Lucide
                                  icon="Eye"
                                  className="w-4 h-4 mr-2"
                                />{" "}
                                View Details
                              </Menu.Item>
                              <Menu.Item onClick={() => handleToggleCourseStatus(course.id)}>
                                <Lucide
                                  icon={course.isActive ? "XCircle" : "CheckCircle"}
                                  className="w-4 h-4 mr-2"
                                />{" "}
                                {course.isActive ? "Deactivate" : "Activate"}
                              </Menu.Item>
                              <Menu.Item>
                                <Lucide
                                  icon="Users"
                                  className="w-4 h-4 mr-2"
                                />{" "}
                                View Enrollments
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
                          {searchTerm || statusFilter !== "all" 
                            ? "No courses match your search criteria" 
                            : "No courses found"}
                        </div>
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
  );
});

export default CourseManagementTab;
