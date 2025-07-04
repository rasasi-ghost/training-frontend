import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import { FormSelect, FormInput } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import Button from "@/components/Base/Button";
import { CoursesController } from "@/controllers";
import LoadingIcon from "@/components/Base/LoadingIcon";


import { Menu } from "@/components/Base/Headless";

import transactions from "@/fakers/transactions";
import Table from "@/components/Base/Table";
import clsx from "clsx";
import _ from "lodash";

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
  useEffect(() => {
    CoursesController.loadDashboardData();
  }, []);

  const isLoading = CoursesController.isLoading;
  const pendingCourses = CoursesController.pendingCourses;
  const approvedCourses = CoursesController.approvedCourses;
  const completedCourses = CoursesController.completedCourses;
  const availableCoursesCount = CoursesController.availableCoursesCount;

  // Get a sample grade for completed courses (in a real app, this would come from the API)
  const getRandomGrade = () => {
    return Math.floor(Math.random() * 30) + 70; // Random grade between 70-100
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

        {/* Course List Section */}
        {!isLoading && (
          <div className="mt-8 grid grid-cols-1 gap-5">
            {/* Pending Courses */}
            {pendingCourses.length > 0 && (
              <div className="box box--stacked p-5">
                <h2 className="text-lg font-medium mb-4">Pending Enrollments</h2>
                <div className="overflow-auto">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Course Title</th>
                        <th>Instructor</th>
                        <th>Status</th>
                        <th>Enrollment Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingCourses.map((course) => {
                        const enrollment = CoursesController.getEnrollmentForCourse(course.id);
                        return (
                          <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.instructorName}</td>
                            <td>
                              <span className="px-2 py-1 rounded bg-warning/20 text-warning">
                                Pending
                              </span>
                            </td>
                            <td>{enrollment?.enrollmentDate?.substring(0, 10) || "N/A"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Approved Courses */}
            {approvedCourses.length > 0 && (
              <div className="box box--stacked p-5">
                <h2 className="text-lg font-medium mb-4">Current Courses</h2>
                <div className="overflow-auto">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Course Title</th>
                        <th>Instructor</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedCourses.map((course) => (
                        <tr key={course.id}>
                          <td>{course.title}</td>
                          <td>{course.instructorName}</td>
                          <td>{course.startDate?.substring(0, 10) || "N/A"}</td>
                          <td>{course.endDate?.substring(0, 10) || "N/A"}</td>
                          <td>{course.credits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <div className="box box--stacked p-5">
                <h2 className="text-lg font-medium mb-4">Completed Courses</h2>
                <div className="overflow-auto">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Course Title</th>
                        <th>Instructor</th>
                        <th>Credits</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedCourses.map((course) => {
                        const grade = getRandomGrade(); // In a real app, this would come from the API
                        return (
                          <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.instructorName}</td>
                            <td>{course.credits}</td>
                            <td>
                              <span className={`px-2 py-1 rounded ${grade >= 90 ? "bg-success/20 text-success" :
                                grade >= 70 ? "bg-primary/20 text-primary" :
                                  "bg-danger/20 text-danger"
                                }`}>
                                {grade}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center h-10 pt-5">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            My Active Courses
          </div>
        </div>
        <div className="mt-2 overflow-auto lg:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate">
            <Table.Tbody>
              {_.take(transactions.fakeTransactions(), 5).map(
                (faker, fakerKey) => (
                  <Table.Tr key={fakerKey}>
                    <Table.Td className="box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] rounded-l-none rounded-r-none border-x-0 dark:bg-darkmode-600">
                      <div className="flex items-center">
                        <Lucide
                          icon={faker.category.icon}
                          className="w-6 h-6 text-theme-1 fill-primary/10 stroke-[0.8]"
                        />
                        <div className="ml-3.5">
                          <a href="" className="font-medium whitespace-nowrap">
                            {faker.orderId}
                          </a>
                          <div className="mt-1 text-xs text-slate-500 whitespace-nowrap">
                            {faker.category.name}
                          </div>
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td className="w-60 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] rounded-l-none rounded-r-none border-x-0 dark:bg-darkmode-600">
                      <div className="mb-1 text-xs text-slate-500 whitespace-nowrap">
                        Customer Name
                      </div>
                      <a href="" className="flex items-center text-primary">
                        <Lucide
                          icon="ExternalLink"
                          className="w-3.5 h-3.5 stroke-[1.7]"
                        />
                        <div className="ml-1.5 whitespace-nowrap">
                          {faker.user.name}
                        </div>
                      </a>
                    </Table.Td>
                    <Table.Td className="w-44 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] rounded-l-none rounded-r-none border-x-0 dark:bg-darkmode-600">
                      <div className="mb-1.5 text-xs text-slate-500 whitespace-nowrap">
                        Purchased Items
                      </div>
                      <div className="flex mb-1">
                        <div className="w-5 h-5 image-fit zoom-in">
                          <Tippy
                            as="img"
                            alt="Tailwise - Admin Dashboard Template"
                            className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                            src={faker.products[0].images[0].path}
                            content={faker.products[0].name}
                          />
                        </div>
                        <div className="w-5 h-5 -ml-1.5 image-fit zoom-in">
                          <Tippy
                            as="img"
                            alt="Tailwise - Admin Dashboard Template"
                            className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                            src={faker.products[1].images[0].path}
                            content={faker.products[1].name}
                          />
                        </div>
                        <div className="w-5 h-5 -ml-1.5 image-fit zoom-in">
                          <Tippy
                            as="img"
                            alt="Tailwise - Admin Dashboard Template"
                            className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                            src={faker.products[2].images[0].path}
                            content={faker.products[2].name}
                          />
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td className="w-44 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] rounded-l-none rounded-r-none border-x-0 dark:bg-darkmode-600">
                      <div className="mb-1 text-xs text-slate-500 whitespace-nowrap">
                        Status
                      </div>
                      <div
                        className={clsx([
                          "flex items-center",
                          faker.orderStatus.textColor,
                        ])}
                      >
                        <Lucide
                          icon={faker.orderStatus.icon}
                          className="w-3.5 h-3.5 stroke-[1.7]"
                        />
                        <div className="ml-1.5 whitespace-nowrap">
                          {faker.orderStatus.name}
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td className="w-44 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] rounded-l-none rounded-r-none border-x-0 dark:bg-darkmode-600">
                      <div className="mb-1 text-xs text-slate-500 whitespace-nowrap">
                        Date
                      </div>
                      <div className="whitespace-nowrap">{faker.orderDate}</div>
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
                            <Menu.Item>
                              <Lucide
                                icon="WalletCards"
                                className="w-4 h-4 mr-2"
                              />{" "}
                              View Details
                            </Menu.Item>
                            <Menu.Item>
                              <Lucide icon="FilePen" className="w-4 h-4 mr-2" />
                              Edit Order
                            </Menu.Item>
                            <Menu.Item>
                              <Lucide icon="Printer" className="w-4 h-4 mr-2" />
                              Print Invoice
                            </Menu.Item>
                          </Menu.Items>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                )
              )}
            </Table.Tbody>
          </Table>
        </div>

      </div>
    </div>
  );
});

export default StudentDashboard;
