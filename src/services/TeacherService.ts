import ApiService from "./ApiService";

export enum TeacherApprovalStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  maxEnrollment: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  lectures?: Lecture[];
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  status: number; // 0: Pending, 1: Approved, 2: Completed
  statusString: string;
  enrollmentDate: string;
  grade?: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  maxEnrollment: number;
  startDate: string;
  endDate: string;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  maxEnrollment?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface LectureRequest {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface UpdateEnrollmentStatusRequest {
  status: number;
}

export interface SetGradeRequest {
  enrollmentId: string;
  studentId: string;
  grade: string;
}

export interface ApprovalStatusResponse {
  status: TeacherApprovalStatus;
  message: string;
}

class TeacherService {
  // Approval Status
  public async checkApprovalStatus(): Promise<ApprovalStatusResponse> {
    return ApiService.get<ApprovalStatusResponse>("/teacher/approval-status");
  }

  // Courses
  public async getTeacherCourses(): Promise<Course[]> {
    return ApiService.get<Course[]>("/teacher/courses");
  }

  public async getCourse(courseId: string): Promise<Course> {
    return ApiService.get<Course>(`/teacher/courses/${courseId}`);
  }

  public async createCourse(courseData: CreateCourseRequest): Promise<{id: string; course: Course}> {
    return ApiService.post<{id: string; course: Course}>("/teacher/courses", courseData);
  }

  public async updateCourse(courseId: string, courseData: UpdateCourseRequest): Promise<Course> {
    return ApiService.put<Course>(`/teacher/courses/${courseId}`, courseData);
  }

  // Lectures
  public async addLecture(courseId: string, lectureData: LectureRequest): Promise<Lecture> {
    return ApiService.post<Lecture>(`/teacher/courses/${courseId}/lectures`, lectureData);
  }

  public async updateLecture(courseId: string, lectureId: string, lectureData: LectureRequest): Promise<Lecture> {
    return ApiService.put<Lecture>(`/teacher/courses/${courseId}/lectures/${lectureId}`, lectureData);
  }

  public async deleteLecture(courseId: string, lectureId: string): Promise<{message: string}> {
    return ApiService.delete<{message: string}>(`/teacher/courses/${courseId}/lectures/${lectureId}`);
  }

  // Enrollments
  public async getCourseEnrollments(courseId: string): Promise<Enrollment[]> {
    return ApiService.get<Enrollment[]>(`/teacher/courses/${courseId}/enrollments`);
  }

  public async updateEnrollmentStatus(enrollmentId: string, statusData: UpdateEnrollmentStatusRequest): Promise<{message: string}> {
    return ApiService.put<{message: string}>(`/teacher/enrollments/${enrollmentId}/status`, statusData);
  }

  public async setGrade(gradeData: SetGradeRequest): Promise<{message: string}> {
    return ApiService.post<{message: string}>(`/teacher/set-grade`, gradeData);
  }
}

export default new TeacherService();
