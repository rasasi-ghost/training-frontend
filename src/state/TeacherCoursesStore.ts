import { makeAutoObservable, runInAction } from "mobx";
import TeacherService, { 
  Course, 
  Enrollment, 
  Lecture,
  CreateCourseRequest,
  UpdateCourseRequest,
  LectureRequest,
  TeacherApprovalStatus
} from "../services/TeacherService";

class TeacherCoursesStore {
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  courseEnrollments: Enrollment[] = [];
  loading: boolean = false;
  error: string | null = null;
  approvalStatus: TeacherApprovalStatus = TeacherApprovalStatus.Pending;
  approvalMessage: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  // Reset states
  reset() {
    this.courses = [];
    this.selectedCourse = null;
    this.courseEnrollments = [];
    this.loading = false;
    this.error = null;
    this.approvalStatus = TeacherApprovalStatus.Pending;
    this.approvalMessage = "";
  }

  // Error handling
  setError(error: string | null) {
    this.error = error;
  }

  // Approval Status
  async checkApprovalStatus() {
    this.loading = true;
    this.error = null;
    try {
      const response = await TeacherService.checkApprovalStatus();
      runInAction(() => {
        this.approvalStatus = response.status;
        this.approvalMessage = response.message;
        this.loading = false;
      });
      return this.approvalStatus === TeacherApprovalStatus.Approved;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to check approval status";
        this.loading = false;
      });
      throw error;
    }
  }

  // Course operations
  async fetchTeacherCourses() {
    this.loading = true;
    this.error = null;
    try {
      const courses = await TeacherService.getTeacherCourses();
      runInAction(() => {
        this.courses = courses;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to fetch courses";
        this.loading = false;
      });
    }
  }

  async fetchCourse(courseId: string) {
    this.loading = true;
    this.error = null;
    try {
      const course = await TeacherService.getCourse(courseId);
      runInAction(() => {
        this.selectedCourse = course;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to fetch course details";
        this.loading = false;
      });
    }
  }

  async createCourse(courseData: CreateCourseRequest) {
    this.loading = true;
    this.error = null;
    try {
      const response = await TeacherService.createCourse(courseData);
      runInAction(() => {
        this.courses.push(response.course);
        this.loading = false;
      });
      return response.id;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to create course";
        this.loading = false;
      });
      throw error;
    }
  }

  async updateCourse(courseId: string, courseData: UpdateCourseRequest) {
    this.loading = true;
    this.error = null;
    try {
      const updatedCourse = await TeacherService.updateCourse(courseId, courseData);
      runInAction(() => {
        this.courses = this.courses.map(course => 
          course.id === courseId ? updatedCourse : course
        );
        if (this.selectedCourse?.id === courseId) {
          this.selectedCourse = updatedCourse;
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to update course";
        this.loading = false;
      });
      throw error;
    }
  }

  // Lecture operations
  async addLecture(courseId: string, lectureData: LectureRequest) {
    this.loading = true;
    this.error = null;
    try {
      const lecture = await TeacherService.addLecture(courseId, lectureData);
      runInAction(() => {
        if (this.selectedCourse && this.selectedCourse.id === courseId) {
          if (!this.selectedCourse.lectures) {
            this.selectedCourse.lectures = [];
          }
          this.selectedCourse.lectures.push(lecture);
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to add lecture";
        this.loading = false;
      });
      throw error;
    }
  }

  async updateLecture(courseId: string, lectureId: string, lectureData: LectureRequest) {
    this.loading = true;
    this.error = null;
    try {
      const updatedLecture = await TeacherService.updateLecture(courseId, lectureId, lectureData);
      runInAction(() => {
        if (this.selectedCourse && this.selectedCourse.id === courseId && this.selectedCourse.lectures) {
          this.selectedCourse.lectures = this.selectedCourse.lectures.map(lecture => 
            lecture.id === lectureId ? updatedLecture : lecture
          );
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to update lecture";
        this.loading = false;
      });
      throw error;
    }
  }

  async deleteLecture(courseId: string, lectureId: string) {
    this.loading = true;
    this.error = null;
    try {
      await TeacherService.deleteLecture(courseId, lectureId);
      runInAction(() => {
        if (this.selectedCourse && this.selectedCourse.id === courseId && this.selectedCourse.lectures) {
          this.selectedCourse.lectures = this.selectedCourse.lectures.filter(
            lecture => lecture.id !== lectureId
          );
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to delete lecture";
        this.loading = false;
      });
      throw error;
    }
  }

  // Enrollment operations
  async fetchCourseEnrollments(courseId: string) {
    this.loading = true;
    this.error = null;
    try {
      const enrollments = await TeacherService.getCourseEnrollments(courseId);
      runInAction(() => {
        this.courseEnrollments = enrollments;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to fetch enrollments";
        this.loading = false;
      });
    }
  }

  async updateEnrollmentStatus(enrollmentId: string, status: number) {
    this.loading = true;
    this.error = null;
    try {
      await TeacherService.updateEnrollmentStatus(enrollmentId, { status });
      runInAction(() => {
        this.courseEnrollments = this.courseEnrollments.map(enrollment => {
          if (enrollment.id === enrollmentId) {
            return {
              ...enrollment,
              status,
              statusString: status === 0 ? "Pending" : status === 1 ? "Approved" : "Completed"
            };
          }
          return enrollment;
        });
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to update enrollment status";
        this.loading = false;
      });
      throw error;
    }
  }

  async setStudentGrade(enrollmentId: string, studentId: string, grade: string) {
    this.loading = true;
    this.error = null;
    try {
      await TeacherService.setGrade({ enrollmentId, studentId, grade });
      runInAction(() => {
        this.courseEnrollments = this.courseEnrollments.map(enrollment => {
          if (enrollment.id === enrollmentId) {
            return { ...enrollment, grade };
          }
          return enrollment;
        });
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to set grade";
        this.loading = false;
      });
      throw error;
    }
  }
}

export default new TeacherCoursesStore();
