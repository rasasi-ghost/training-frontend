import ApiService from "./ApiService";

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  startDate: string;
  endDate: string;
  maxEnrollment: number;
  isActive: boolean;
  credits: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  status: number, // 0: Pending, 1: Approved, 2: Completed
  statusStringlog: string;
  enrollmentDate: string;
  grade?: number;
}

export interface EnrolledCourseDetails {
  enrollment: Enrollment;
  course: Course;
}

class CourseService {
  public async getAvailableCourses(): Promise<Course[]> {
    return ApiService.get<Course[]>("/student/courses");
  }

  public async getStudentEnrollments(): Promise<Enrollment[]> {
    return ApiService.get<Enrollment[]>("/student/enrollments");
  }

  public async getEnrolledCourses(): Promise<Course[]> {
    return ApiService.get<Course[]>("/student/courses/enrolled");
  }

  public async getEnrollmentDetails(enrollmentId: string): Promise<EnrolledCourseDetails> {
    return ApiService.get<EnrolledCourseDetails>(`/student/enrollments/${enrollmentId}`);
  }

  public async enrollInCourse(courseId: string): Promise<{id: string; message: string}> {
    return ApiService.post<{id: string; message: string}>(`/student/courses/${courseId}/enroll`);
  }
}

export default new CourseService();
