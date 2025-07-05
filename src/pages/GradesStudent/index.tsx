import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import { FormInput } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { CoursesController } from "@/controllers";
import { Menu } from "@/components/Base/Headless";

const GradesStudent = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        await CoursesController.loadDashboardData();
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading course data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get all enrolled courses
  const allCourses = [
    ...CoursesController.completedCourses,
    ...CoursesController.approvedCourses,
    ...CoursesController.pendingCourses,
  ];

  // Simple stats for the cards
  const completedCount = CoursesController.completedCourses.length;
  const inProgressCount = CoursesController.approvedCourses.length;
  const pendingCount = CoursesController.pendingCourses.length;
  const totalCredits = allCourses.reduce(
    (sum, course) => sum + (course.credits || 0),
    0
  );

  // Filter courses based on search term
  const filteredCourses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            My Course Grades
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
            <Button
              variant="outline-secondary"
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent dark:group-[.mode--light]:!bg-darkmode-900/30 dark:!box"
            >
              <Lucide icon="Download" className="stroke-[1.3] w-4 h-4 mr-2" />{" "}
              Export Grades
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-8 mt-3.5">
          {/* Stats Cards */}
          <div className="flex flex-col p-5 box box--stacked">
            <div className="grid grid-cols-4 gap-5">
              {/* Completed Courses Card */}
              <div className="col-span-4 md:col-span-2 xl:col-span-1 p-5 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
                <div className="text-base text-slate-500">Completed Courses</div>
                {isLoading ? (
                  <div className="mt-1.5 h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
                ) : (
                  <div className="mt-1.5 text-2xl font-medium">{completedCount}</div>
                )}
                <div className="absolute inset-y-0 right-0 flex flex-col justify-center mr-5">
                  <div className="flex items-center border border-success/10 bg-success/10 rounded-full pl-[7px] pr-1 py-[2px] text-xs font-medium text-success">
                    <Lucide icon="CheckCircle" className="w-4 h-4 ml-px" />
                  </div>
                </div>
              </div>
              
              {/* In Progress Card */}
              <div className="col-span-4 md:col-span-2 xl:col-span-1 p-5 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
                <div className="text-base text-slate-500">In Progress</div>
                {isLoading ? (
                  <div className="mt-1.5 h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
                ) : (
                  <div className="mt-1.5 text-2xl font-medium">{inProgressCount}</div>
                )}
                <div className="absolute inset-y-0 right-0 flex flex-col justify-center mr-5">
                  <div className="flex items-center border border-primary/10 bg-primary/10 rounded-full pl-[7px] pr-1 py-[2px] text-xs font-medium text-primary">
                    <Lucide icon="Clock" className="w-4 h-4 ml-px" />
                  </div>
                </div>
              </div>
              
              {/* Pending Approval Card */}
              <div className="col-span-4 md:col-span-2 xl:col-span-1 p-5 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
                <div className="text-base text-slate-500">Pending Approval</div>
                {isLoading ? (
                  <div className="mt-1.5 h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
                ) : (
                  <div className="mt-1.5 text-2xl font-medium">{pendingCount}</div>
                )}
                <div className="absolute inset-y-0 right-0 flex flex-col justify-center mr-5">
                  <div className="flex items-center border border-warning/10 bg-warning/10 rounded-full pl-[7px] pr-1 py-[2px] text-xs font-medium text-warning">
                    <Lucide icon="AlertCircle" className="w-4 h-4 ml-px" />
                  </div>
                </div>
              </div>
              
              {/* Total Credits Card */}
              <div className="col-span-4 md:col-span-2 xl:col-span-1 p-5 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
                <div className="text-base text-slate-500">Total Credits</div>
                {isLoading ? (
                  <div className="mt-1.5 h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
                ) : (
                  <div className="mt-1.5 text-2xl font-medium">{totalCredits}</div>
                )}
                <div className="absolute inset-y-0 right-0 flex flex-col justify-center mr-5">
                  <div className="flex items-center border border-info/10 bg-info/10 rounded-full pl-[7px] pr-1 py-[2px] text-xs font-medium text-info">
                    <Lucide icon="BookOpen" className="w-4 h-4 ml-px" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grades Table */}
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
                    className="pl-9 sm:w-64 rounded-[0.5rem]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="p-5">
                {/* Table header shimmer */}
                <div className="flex mb-4">
                  <div className="w-1/3 h-10 bg-slate-200 animate-pulse rounded-md mr-2"></div>
                  <div className="w-1/6 h-10 bg-slate-200 animate-pulse rounded-md mr-2"></div>
                  <div className="w-1/6 h-10 bg-slate-200 animate-pulse rounded-md mr-2"></div>
                  <div className="w-1/6 h-10 bg-slate-200 animate-pulse rounded-md mr-2"></div>
                  <div className="w-1/12 h-10 bg-slate-200 animate-pulse rounded-md"></div>
                </div>
                
                {/* Table rows shimmer */}
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex py-4 border-t border-slate-200/60">
                    <div className="w-1/3 mr-2">
                      <div className="h-5 bg-slate-200 animate-pulse rounded-md mb-2 w-3/4"></div>
                      <div className="h-3 bg-slate-200 animate-pulse rounded-md w-1/2"></div>
                    </div>
                    <div className="w-1/6 mr-2">
                      <div className="h-5 bg-slate-200 animate-pulse rounded-md w-4/5"></div>
                    </div>
                    <div className="w-1/6 mr-2">
                      <div className="h-5 bg-slate-200 animate-pulse rounded-md w-2/3 mx-auto"></div>
                    </div>
                    <div className="w-1/6 mr-2">
                      <div className="h-5 bg-slate-200 animate-pulse rounded-md w-1/2 mx-auto"></div>
                    </div>
                    <div className="w-1/12">
                      <div className="h-5 bg-slate-200 animate-pulse rounded-md w-5 mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-auto xl:overflow-visible">
                <Table className="border-b border-slate-200/60">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        Course
                      </Table.Td>
                      <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        Instructor
                      </Table.Td>
                      <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        Status
                      </Table.Td>
                      <Table.Td className="py-4 font-medium border-t text-center bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        Grade
                      </Table.Td>
                      <Table.Td className="w-20 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        Action
                      </Table.Td>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => {
                        const enrollment =
                          CoursesController.getEnrollmentForCourse(course.id);
                        const status = enrollment?.statusString || "Unknown";
                        const grade = enrollment?.grade;

                        let gradeDisplay = "Not Finished";
                        let gradeColor = "text-slate-500";

                        if (grade !== undefined && grade !== null) {
                          gradeDisplay = `${grade}%`;
                          gradeColor =
                            grade >= 90
                              ? "text-success"
                              : grade >= 70
                              ? "text-primary"
                              : grade >= 60
                              ? "text-warning"
                              : "text-danger";
                        }

                        return (
                          <Table.Tr
                            key={course.id}
                            className="[&_td]:last:border-b-0"
                          >
                            <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                              <div className="font-medium whitespace-nowrap">
                                {course.title}
                              </div>
                              <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                {course.credits} Credits
                              </div>
                            </Table.Td>
                            <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                              {course.instructorName}
                            </Table.Td>
                            <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                              <div
                                className={`flex items-center ${
                                  status === "Approved"
                                    ? "text-success"
                                    : status === "Pending"
                                    ? "text-warning"
                                    : status === "Completed"
                                    ? "text-primary"
                                    : ""
                                }`}
                              >
                                <Lucide
                                  icon={
                                    status === "Approved"
                                      ? "CheckCircle"
                                      : status === "Pending"
                                      ? "Clock"
                                      : status === "Completed"
                                      ? "Award"
                                      : "Info"
                                  }
                                  className="w-3.5 h-3.5 stroke-[1.7]"
                                />
                                <div className="ml-1.5 whitespace-nowrap">
                                  {status}
                                </div>
                              </div>
                            </Table.Td>
                            <Table.Td
                              className={`py-4 text-center border-dashed dark:bg-darkmode-600 font-medium ${gradeColor}`}
                            >
                              {gradeDisplay}
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
                                        icon="FileText"
                                        className="w-4 h-4 mr-2"
                                      />
                                      View Details
                                    </Menu.Item>
                                    {status === "Completed" && (
                                      <Menu.Item>
                                        <Lucide
                                          icon="Award"
                                          className="w-4 h-4 mr-2"
                                        />
                                        View Certificate
                                      </Menu.Item>
                                    )}
                                  </Menu.Items>
                                </Menu>
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        );
                      })
                    ) : (
                      <Table.Tr>
                        <Table.Td colSpan={5} className="text-center py-4">
                          No courses found
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default GradesStudent;
