import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { ChartElement } from "@/components/Base/Chart";
import { useStore } from "@/state/MobxStoreProvider";

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'course_creation' | 'user_registration' | 'teacher_approval';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  courseId?: string;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  activeCourses: number;
  totalEnrollments: number;
  pendingTeachers: number;
  recentActivities: RecentActivity[];
}

const SystemOverviewTab: React.FC = observer(() => {
  const { adminUsecasesStore } = useStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats | null>(null);
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, fetch real data
        // const systemStats = await adminUsecasesStore.fetchSystemStats();
        
        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            totalUsers: adminUsecasesStore.users.length || 150,
            activeUsers: 120,
            totalCourses: 25,
            activeCourses: 18,
            totalEnrollments: 450,
            pendingTeachers: adminUsecasesStore.pendingTeachers.length || 3,
            recentActivities: [
              {
                id: "1",
                type: "enrollment",
                title: "New Enrollment",
                description: "John Doe enrolled in Introduction to Computer Science",
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
                userId: "user1",
                courseId: "course1"
              },
              {
                id: "2",
                type: "user_registration",
                title: "New User Registration",
                description: "Jane Smith registered as a new student",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                userId: "user2"
              },
              {
                id: "3",
                type: "course_creation",
                title: "New Course Created",
                description: "Advanced Programming course was created by Dr. Johnson",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
                courseId: "course2"
              },
              {
                id: "4",
                type: "teacher_approval",
                title: "Teacher Approved",
                description: "Dr. Emily Davis was approved as a teacher",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
                userId: "user3"
              }
            ]
          });
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Failed to load system statistics:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [adminUsecasesStore]);
  
  // Format time for recent activity
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
    
    return date.toLocaleDateString();
  };
  
  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return "UserPlus";
      case 'course_creation':
        return "BookPlus";
      case 'user_registration':
        return "UserCheck";
      case 'teacher_approval':
        return "Award";
      default:
        return "Activity";
    }
  };
  
  // Chart data
  const userGrowthData = {
    options: {
      chart: {
        type: 'area',
        height: 280,
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      colors: ['#3160D8'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
    },
    series: [
      {
        name: 'Users',
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 160, 170, 180],
      },
    ],
  };
  
  const courseGrowthData = {
    options: {
      chart: {
        type: 'bar',
        height: 280,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      colors: ['#2E9D5F'],
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " courses";
          },
        },
      },
    },
    series: [
      {
        name: 'Courses',
        data: [2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
    ],
  };
  
  return (
    <div className="flex flex-col gap-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-12 gap-5">
        <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] p-0.5 border border-primary/80 rounded-full bg-slate-50 cursor-pointer">
              <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70">
                <Lucide icon="Users" className="w-full h-full text-primary" />
              </div>
            </div>
            <div className="ml-4">
              <div className="-mt-0.5 text-lg font-medium text-primary">
                Total Users
              </div>
              <div className="mt-0.5 text-slate-500">All Users</div>
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
                  <div className="text-xl font-medium leading-tight">{stats?.totalUsers || 0}</div>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  {stats?.activeUsers || 0} active
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] p-0.5 border border-success/80 rounded-full bg-slate-50 cursor-pointer">
              <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70">
                <Lucide icon="BookOpen" className="w-full h-full text-success" />
              </div>
            </div>
            <div className="ml-4">
              <div className="-mt-0.5 text-lg font-medium text-success">
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
                  <div className="text-xl font-medium leading-tight">{stats?.totalCourses || 0}</div>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  {stats?.activeCourses || 0} active
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] p-0.5 border border-warning/80 rounded-full bg-slate-50 cursor-pointer">
              <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70">
                <Lucide icon="GraduationCap" className="w-full h-full text-warning" />
              </div>
            </div>
            <div className="ml-4">
              <div className="-mt-0.5 text-lg font-medium text-warning">
                Enrollments
              </div>
              <div className="mt-0.5 text-slate-500">All Enrollments</div>
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
                  <div className="text-xl font-medium leading-tight">{stats?.totalEnrollments || 0}</div>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Total Enrollments
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] p-0.5 border border-danger/80 rounded-full bg-slate-50 cursor-pointer">
              <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70">
                <Lucide icon="AlertCircle" className="w-full h-full text-danger" />
              </div>
            </div>
            <div className="ml-4">
              <div className="-mt-0.5 text-lg font-medium text-danger">
                Pending Approvals
              </div>
              <div className="mt-0.5 text-slate-500">Teachers</div>
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
                  <div className="text-xl font-medium leading-tight">{stats?.pendingTeachers || 0}</div>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Pending Requests
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-12 gap-5">
        <div className="flex flex-col col-span-12 lg:col-span-6 box box--stacked">
          <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
            <div className="text-base font-medium">User Growth</div>
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
              <Button variant="outline-secondary" size="sm">
                <Lucide icon="RefreshCw" className="w-4 h-4 mr-1" /> Refresh
              </Button>
            </div>
          </div>
         
        </div>
        
        <div className="flex flex-col col-span-12 lg:col-span-6 box box--stacked">
          <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
            <div className="text-base font-medium">Course Growth</div>
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
              <Button variant="outline-secondary" size="sm">
                <Lucide icon="RefreshCw" className="w-4 h-4 mr-1" /> Refresh
              </Button>
            </div>
          </div>
          <div className="p-5 pt-0">
          
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="flex flex-col box box--stacked">
        <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
          <div className="text-base font-medium">Recent Activity</div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
            <Button variant="outline-secondary" size="sm">
              <Lucide icon="RefreshCw" className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>
        <div className="p-5 pt-0">
          {loading ? (
            // Shimmer loading for activity list
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center p-3 rounded border border-slate-200/60">
                  <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
                  <div className="ml-3 flex-1">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-1/3 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3"></div>
                  </div>
                  <div className="h-3 bg-slate-200 rounded animate-pulse w-20"></div>
                </div>
              ))}
            </div>
          ) : stats?.recentActivities && stats.recentActivities.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center p-3 rounded border border-slate-200/60 hover:bg-slate-50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lucide icon={getActivityIcon(activity.type)} className="w-5 h-5 text-primary" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="font-medium">{activity.title}</div>
                    <div className="text-slate-500 text-xs">{activity.description}</div>
                  </div>
                  <div className="text-xs text-slate-500">{formatTimeAgo(activity.timestamp)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lucide icon="Calendar" className="w-16 h-16 mx-auto text-slate-300" />
              <div className="mt-2 text-slate-500">No recent activity found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default SystemOverviewTab;
