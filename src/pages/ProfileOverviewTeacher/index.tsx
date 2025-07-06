import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import { Menu, Popover, Tab } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import LoadingIcon from "@/components/Base/LoadingIcon";
import clsx from "clsx";
import _ from "lodash";
import TeacherCoursesStore from "@/state/TeacherCoursesStore";
import UserStore from "@/state/UserStore";

const ProfileOverviewTeacher: React.FC = observer(() => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState({
    id: "",
    name: "",
    email: "",
    department: "Computer Science",
    registrationDate: "January 2023",
    teacherId: "TCH12345",
    status: "Active",
    coursesCreated: 0,
    activeStudents: 0,
    teachingHours: 120,
    expertise: ["Programming", "Data Science", "Web Development"],
    qualification: "PhD in Computer Science",
    photo: "/src/assets/images/users/user-2.jpg",
    institution: "Tech University"
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check teacher approval status
        await TeacherCoursesStore.checkApprovalStatus();
        
        // Fetch teacher's courses if approved
        if (TeacherCoursesStore.approvalStatus === 1) { // Approved
          await TeacherCoursesStore.fetchTeacherCourses();
        }
        
        // Set teacher info from user store
        if (UserStore.currentUser) {
          setTeacherInfo(prev => ({
            ...prev,
            id: UserStore.currentUser?.id || "",
            name: UserStore.currentUser?.displayName || "Teacher",
            email: UserStore.currentUser?.email || "teacher@example.com",
            teacherId: UserStore.currentUser?.id || "TCH12345",
            qualification: "PhD",
            department: "Marketting",
            coursesCreated: TeacherCoursesStore.courses.length
          }));
        }

        // Calculate active students from enrollments
        let totalStudents = 0;
        TeacherCoursesStore.courses.forEach(course => {
          totalStudents += course.enrollmentCount || 0;
        });
        
        setTeacherInfo(prev => ({
          ...prev,
          activeStudents: totalStudents
        }));

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading teacher data:", error);
        setIsLoading(false);
      }
    };

    loadData();

    if (queryParams.get("page") === "courses") {
      setSelectedIndex(1);
    } else if (queryParams.get("page") === "students") {
      setSelectedIndex(2);
    } else if (queryParams.get("page") === "resources") {
      setSelectedIndex(3);
    } else {
      setSelectedIndex(0);
    }
  }, [search]);

  const activeCourses = TeacherCoursesStore.courses.filter(course => course.isActive);
  const inactiveCourses = TeacherCoursesStore.courses.filter(course => !course.isActive);
  const isApproved = TeacherCoursesStore.approvalStatus === 1;

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="p-1.5 box flex flex-col box--stacked">
          <div className="h-48 relative w-full rounded-[0.6rem] bg-gradient-to-b from-theme-1/95 to-theme-2/95">
            <div
              className={clsx([
                "w-full h-full relative overflow-hidden",
                "before:content-[''] before:absolute before:inset-0 before:bg-texture-white before:-mt-[50rem]",
                "after:content-[''] after:absolute after:inset-0 after:bg-texture-white after:-mt-[50rem]",
              ])}
            ></div>
            <div className="absolute inset-x-0 top-0 w-32 h-32 mx-auto mt-24">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center border-[6px] box border-white rounded-full bg-slate-200 animate-pulse">
                  <LoadingIcon icon="oval" className="w-12 h-12 text-slate-400" />
                </div>
              ) : (
                <div className="w-full h-full overflow-hidden border-[6px] box border-white rounded-full image-fit">
                  <img
                    alt="Teacher Profile"
                    src={teacherInfo.photo}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/src/assets/images/placeholders/200x200.jpg";
                    }}
                  />
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-5 h-5 mb-2.5 mr-2.5 border-2 border-white rounded-full bg-success box dark:bg-success"></div>
            </div>
          </div>
          <div className="rounded-[0.6rem] bg-slate-50 pt-12 pb-6 dark:bg-darkmode-500">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-slate-200 rounded animate-pulse mt-3"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center text-xl font-medium">
                  {teacherInfo.name}
                  <Lucide
                    icon="BadgeCheck"
                    className="w-5 h-5 ml-2 text-blue-500 fill-blue-500/30"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-y-2 gap-x-5 mt-2.5">
                  <div className="flex items-center text-slate-500">
                    <Lucide
                      icon="Building2"
                      className="w-3.5 h-3.5 mr-1.5 stroke-[1.3]"
                    />
                    {teacherInfo.institution}
                  </div>
                  <div className="flex items-center text-slate-500">
                    <Lucide
                      icon="BookOpen"
                      className="w-3.5 h-3.5 mr-1.5 stroke-[1.3]"
                    />
                    {teacherInfo.department}
                  </div>
                  <div className="flex items-center text-slate-500">
                    <Lucide
                      icon="Mail"
                      className="w-3.5 h-3.5 mr-1.5 stroke-[1.3]"
                    />
                    {teacherInfo.email}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Tab.Group
          className="mt-10"
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
        >
          <div className="flex flex-col 2xl:items-center 2xl:flex-row gap-y-3">
            <Tab.List
              variant="boxed-tabs"
              className="flex-col sm:flex-row w-full 2xl:w-auto mr-auto box rounded-[0.6rem] border-slate-200"
            >
              <Tab className="first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] [&[aria-selected='true']_button]:text-current">
                <Tab.Button
                  className="w-full xl:w-40 py-2.5 text-slate-500 whitespace-nowrap rounded-[0.6rem] flex items-center justify-center text-[0.94rem]"
                  as="button"
                >
                  Dashboard
                </Tab.Button>
              </Tab>
              <Tab className="first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] [&[aria-selected='true']_button]:text-current">
                <Tab.Button
                  className="w-full xl:w-40 py-2.5 text-slate-500 whitespace-nowrap rounded-[0.6rem] flex items-center justify-center text-[0.94rem]"
                  as="button"
                >
                  Courses
                </Tab.Button>
              </Tab>
              <Tab className="first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] [&[aria-selected='true']_button]:text-current">
                <Tab.Button
                  className="w-full xl:w-40 py-2.5 text-slate-500 whitespace-nowrap rounded-[0.6rem] flex items-center justify-center text-[0.94rem]"
                  as="button"
                >
                  Students
                </Tab.Button>
              </Tab>
              <Tab className="first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] [&[aria-selected='true']_button]:text-current">
                <Tab.Button
                  className="w-full xl:w-40 py-2.5 text-slate-500 whitespace-nowrap rounded-[0.6rem] flex items-center justify-center text-[0.94rem]"
                  as="button"
                >
                  Resources
                </Tab.Button>
              </Tab>
            </Tab.List>
            <div className="flex items-center gap-3 2xl:ml-auto">
              <Popover className="inline-block">
                {({ close }) => (
                  <>
                    <Popover.Button
                      as={Button}
                      variant="outline-secondary"
                      className="rounded-[0.6rem] bg-white py-3 dark:bg-darkmode-400"
                    >
                      <Lucide
                        icon="Bell"
                        className="stroke-[1.3] w-4 h-4 mr-2"
                      />
                      Notifications
                      <div className="flex items-center justify-center h-5 px-1.5 ml-2 text-xs font-medium border rounded-full bg-slate-100 dark:bg-darkmode-400">
                        2
                      </div>
                    </Popover.Button>
                    <Popover.Panel placement="bottom-end">
                      <div className="p-2">
                        <div className="text-base font-medium">Notifications</div>
                        <div className="mt-2 text-slate-500">
                          <div className="flex items-center py-2">
                            <Lucide icon="UserPlus" className="w-4 h-4 mr-2 text-primary" />
                            New student enrollment request
                          </div>
                          <div className="flex items-center py-2">
                            <Lucide icon="Calendar" className="w-4 h-4 mr-2 text-warning" />
                            Reminder: Course starts tomorrow
                          </div>
                        </div>
                        <div className="flex items-center mt-4">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              close();
                            }}
                            className="w-32 ml-auto"
                          >
                            Close
                          </Button>
                          <Button variant="primary" className="w-32 ml-2">
                            View All
                          </Button>
                        </div>
                      </div>
                    </Popover.Panel>
                  </>
                )}
              </Popover>
              <Menu>
                <Menu.Button
                  as={Button}
                  variant="secondary"
                  className="rounded-[0.6rem] bg-white py-3 text-[0.94rem]"
                >
                  <div className="flex items-center justify-center w-5 h-5">
                    <Lucide
                      icon="MoreVertical"
                      className="stroke-[1.3] w-4 h-4"
                    />
                  </div>
                </Menu.Button>
                <Menu.Items className="w-44">
                  <Menu.Item>
                    <Lucide icon="Settings" className="w-4 h-4 mr-2" /> Account Settings
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="BookPlus" className="w-4 h-4 mr-2" /> Create New Course
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="HelpCircle" className="w-4 h-4 mr-2" /> Help Center
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          </div>

          <Tab.Panels>
            <Tab.Panel>
              <div className="grid grid-cols-12 gap-y-7 gap-x-6 mt-3.5">
                <div className="col-span-12 xl:col-span-8">
                  <div className="flex flex-col gap-y-7">
                    {!isApproved && (
                      <div className="flex flex-col p-5 box box--stacked bg-warning/10 border-warning/20">
                        <div className="flex items-center text-warning font-medium">
                          <Lucide icon="AlertTriangle" className="w-5 h-5 mr-2" />
                          Teacher Approval Status: {
                            TeacherCoursesStore.approvalStatus === 0 ? "Pending" : 
                            TeacherCoursesStore.approvalStatus === 2 ? "Rejected" : "Unknown"
                          }
                        </div>
                        <div className="mt-2 text-slate-600">
                          {TeacherCoursesStore.approvalMessage || 
                            "Your teacher account is currently under review. You'll be notified once approved."}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col p-5 box box--stacked">
                      <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                        Teaching Statistics
                      </div>
                      {isLoading ? (
                        <div className="flex flex-col gap-3">
                          <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
                          <div className="h-16 bg-slate-200 rounded animate-pulse"></div>
                          <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                            <div className="p-4 border rounded-md">
                              <div className="text-slate-500 text-xs">Courses</div>
                              <div className="text-2xl font-medium text-primary">{teacherInfo.coursesCreated}</div>
                              <div className="mt-1 text-xs text-success flex items-center">
                                <Lucide icon="BookOpen" className="w-3 h-3 mr-1" />
                                Active Courses
                              </div>
                            </div>
                            <div className="p-4 border rounded-md">
                              <div className="text-slate-500 text-xs">Students</div>
                              <div className="text-2xl font-medium text-primary">{teacherInfo.activeStudents}</div>
                              <div className="mt-1 text-xs text-slate-500">Currently Enrolled</div>
                            </div>
                            <div className="p-4 border rounded-md">
                              <div className="text-slate-500 text-xs">Teaching Hours</div>
                              <div className="text-lg font-medium text-primary">{teacherInfo.teachingHours}</div>
                              <div className="mt-1 text-xs text-success flex items-center">
                                <Lucide icon="Clock" className="w-3 h-3 mr-1" />
                                This Semester
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="mb-2 text-slate-500">Course Completion Rate</div>
                            <div className="flex h-3 mb-1 bg-slate-100 rounded-full">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `85%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-slate-500">
                              85% of students successfully complete your courses
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col p-5 box box--stacked">
                      <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                        Active Courses
                      </div>
                      {isLoading ? (
                        <div className="flex flex-col gap-3">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-slate-200 rounded animate-pulse"></div>
                          ))}
                        </div>
                      ) : activeCourses.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th>Course</Table.Th>
                                <Table.Th>Start Date</Table.Th>
                                <Table.Th>End Date</Table.Th>
                                <Table.Th>Enrollment</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {activeCourses.map((course) => (
                                <Table.Tr key={course.id}>
                                  <Table.Td>
                                    <div className="font-medium">{course.title}</div>
                                    <div className="text-slate-500 text-xs">{course.id}</div>
                                  </Table.Td>
                                  <Table.Td>{new Date(course.startDate).toLocaleDateString()}</Table.Td>
                                  <Table.Td>{new Date(course.endDate).toLocaleDateString()}</Table.Td>
                                  <Table.Td>
                                    <div className="flex items-center">
                                      <span>{course.enrollmentCount || 0}</span>
                                      <span className="text-slate-500 text-xs ml-1">/ {course.maxEnrollment}</span>
                                    </div>
                                  </Table.Td>
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <Lucide icon="BookOpen" className="w-16 h-16 text-slate-300" />
                          <div className="mt-2 text-slate-500">No active courses found</div>
                          {isApproved && (
                            <Button variant="outline-primary" className="mt-4">
                              <Lucide icon="Plus" className="w-4 h-4 mr-2" />
                              Create New Course
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {inactiveCourses.length > 0 && (
                      <div className="flex flex-col p-5 box box--stacked">
                        <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                          Upcoming & Past Courses
                        </div>
                        <div className="overflow-x-auto">
                          <Table>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th>Course</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Start Date</Table.Th>
                                <Table.Th>End Date</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {inactiveCourses.map((course) => {
                                const now = new Date();
                                const startDate = new Date(course.startDate);
                                const endDate = new Date(course.endDate);
                                let status = "Draft";
                                let statusClass = "bg-slate-100 text-slate-500";
                                
                                if (startDate > now) {
                                  status = "Upcoming";
                                  statusClass = "bg-primary/20 text-primary";
                                } else if (endDate < now) {
                                  status = "Completed";
                                  statusClass = "bg-success/20 text-success";
                                }
                                
                                return (
                                  <Table.Tr key={course.id}>
                                    <Table.Td>
                                      <div className="font-medium">{course.title}</div>
                                      <div className="text-slate-500 text-xs">{course.id}</div>
                                    </Table.Td>
                                    <Table.Td>
                                      <span className={`px-2 py-1 text-xs rounded-full ${statusClass}`}>
                                        {status}
                                      </span>
                                    </Table.Td>
                                    <Table.Td>{startDate.toLocaleDateString()}</Table.Td>
                                    <Table.Td>{endDate.toLocaleDateString()}</Table.Td>
                                  </Table.Tr>
                                );
                              })}
                            </Table.Tbody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative col-span-12 row-start-1 xl:col-start-9 xl:col-span-4">
                  <div className="sticky flex flex-col top-[6.2rem] gap-y-7">
                    <div className="flex flex-col p-5 box box--stacked">
                      <div>Complete your profile (90%)</div>
                      <div className="flex h-2 mt-3.5">
                        <div className="h-full first:rounded-l last:rounded-r border border-primary/50 bg-primary/50 w-[90%]"></div>
                        <div className="h-full first:rounded-l last:rounded-r border border-slate-300 bg-slate-100 w-[10%] dark:bg-darkmode-400"></div>
                      </div>
                      <Button
                        variant="primary"
                        className="w-full mt-5 bg-white text-primary border-primary/20 hover:bg-primary/20 dark:bg-darkmode-400"
                      >
                        <Lucide
                          icon="User"
                          className="stroke-[1.3] w-4 h-4 mr-2"
                        />{" "}
                        Update Profile
                      </Button>
                    </div>

                    <div className="flex flex-col p-5 box box--stacked">
                      <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                        Teacher Information
                      </div>
                      {isLoading ? (
                        <div className="flex flex-col gap-3">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-6 bg-slate-200 rounded animate-pulse"></div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-8">
                          <div>
                            <div className="text-xs uppercase text-slate-500">
                              Professional Details
                            </div>
                            <div className="mt-3.5">
                              <div className="flex items-center">
                                <Lucide
                                  icon="Clipboard"
                                  className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                                />
                                Teacher ID: {teacherInfo.teacherId}
                              </div>
                              <div className="flex items-center mt-3">
                                <Lucide
                                  icon="Calendar"
                                  className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                                />
                                Registered: {teacherInfo.registrationDate}
                              </div>
                              <div className="flex items-center mt-3">
                                <Lucide
                                  icon="GraduationCap"
                                  className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                                />
                                Qualification: {teacherInfo.qualification}
                              </div>
                              <div className="flex items-center mt-3">
                                <Lucide
                                  icon="BookOpen"
                                  className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                                />
                                Department: {teacherInfo.department}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs uppercase text-slate-500">
                              Areas of Expertise
                            </div>
                            <div className="mt-3.5 flex flex-wrap gap-2">
                              {teacherInfo.expertise.map((area, index) => (
                                <span 
                                  key={index} 
                                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/10"
                                >
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs uppercase text-slate-500">
                              Contact Information
                            </div>
                            <div className="mt-3.5">
                              <div className="flex items-center">
                                <Lucide
                                  icon="Mail"
                                  className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                                />
                                Email:{" "}
                                <a
                                  href={`mailto:${teacherInfo.email}`}
                                  className="ml-1 text-primary whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]"
                                >
                                  {teacherInfo.email}
                                </a>
                              </div>
                              <div className="flex items-center mt-3">
                                <Lucide
                                  icon="Phone"
                                  className="w-4 h-4 mr-2 stroke-[1.3] text-slate-500"
                                />
                                Office Hours:{" "}
                                <span className="ml-1">
                                  Mon-Fri, 10:00 AM - 4:00 PM
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col p-5 box box--stacked">
                      <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                        Upcoming Schedule
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="p-3 border rounded-md bg-slate-50/50">
                          <div className="flex items-center">
                            <Lucide icon="Video" className="w-5 h-5 text-primary mr-2" />
                            <div className="font-medium">Web Development Lecture</div>
                          </div>
                          <div className="mt-1 text-slate-500 text-xs">Today, 2:00 PM - 4:00 PM</div>
                        </div>
                        <div className="p-3 border rounded-md bg-slate-50/50">
                          <div className="flex items-center">
                            <Lucide icon="Users" className="w-5 h-5 text-warning mr-2" />
                            <div className="font-medium">Office Hours</div>
                          </div>
                          <div className="mt-1 text-slate-500 text-xs">Tomorrow, 10:00 AM - 12:00 PM</div>
                        </div>
                        <div className="p-3 border rounded-md bg-slate-50/50">
                          <div className="flex items-center">
                            <Lucide icon="Calendar" className="w-5 h-5 text-success mr-2" />
                            <div className="font-medium">Department Meeting</div>
                          </div>
                          <div className="mt-1 text-slate-500 text-xs">Friday, 1:00 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
});

export default ProfileOverviewTeacher;
