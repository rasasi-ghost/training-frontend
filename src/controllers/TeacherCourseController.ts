import TeacherCoursesStore from "../state/TeacherCoursesStore";
import TeacherService, { 
  CreateCourseRequest, 
  UpdateCourseRequest, 
  LectureRequest,
  TeacherApprovalStatus
} from "../services/TeacherService";

class TeacherCourseController {
  // Approval status
  async checkApprovalStatus() {
    try {
      const isApproved = await TeacherCoursesStore.checkApprovalStatus();
      return {
        success: true,
        isApproved,
        status: TeacherCoursesStore.approvalStatus,
        message: TeacherCoursesStore.approvalMessage
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to check approval status"
      };
    }
  }

  // Course operations
  async getTeacherCourses() {
    try {
      await TeacherCoursesStore.fetchTeacherCourses();
      return {
        success: true,
        courses: TeacherCoursesStore.courses
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch courses"
      };
    }
  }

  async getCourseDetails(courseId: string) {
    try {
      await TeacherCoursesStore.fetchCourse(courseId);
      return {
        success: true,
        course: TeacherCoursesStore.selectedCourse
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch course details"
      };
    }
  }

  async createCourse(courseData: CreateCourseRequest) {
    try {
      const courseId = await TeacherCoursesStore.createCourse(courseData);
      return {
        success: true,
        courseId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create course"
      };
    }
  }

  async updateCourse(courseId: string, courseData: UpdateCourseRequest) {
    try {
      await TeacherCoursesStore.updateCourse(courseId, courseData);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update course"
      };
    }
  }

  // Lecture operations
  async addLecture(courseId: string, lectureData: LectureRequest) {
    try {
      await TeacherCoursesStore.addLecture(courseId, lectureData);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add lecture"
      };
    }
  }

  async updateLecture(courseId: string, lectureId: string, lectureData: LectureRequest) {
    try {
      await TeacherCoursesStore.updateLecture(courseId, lectureId, lectureData);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update lecture"
      };
    }
  }

  async deleteLecture(courseId: string, lectureId: string) {
    try {
      await TeacherCoursesStore.deleteLecture(courseId, lectureId);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete lecture"
      };
    }
  }

  async getCourseLectures(courseId: string) {
    try {
      const response = await TeacherService.getCourseLectures(courseId);
      return {
        success: true,
        lectures: response.data.lectures
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load lectures"
      };
    }
  }

  // Enrollment operations
  async getCourseEnrollments(courseId: string) {
    try {
      await TeacherCoursesStore.fetchCourseEnrollments(courseId);
      return {
        success: true,
        enrollments: TeacherCoursesStore.courseEnrollments
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch enrollments"
      };
    }
  }

  async updateEnrollmentStatus(enrollmentId: string, status: number) {
    try {
      await TeacherCoursesStore.updateEnrollmentStatus(enrollmentId, status);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update enrollment status"
      };
    }
  }

  async setStudentGrade(enrollmentId: string, studentId: string, grade: string) {
    try {
      await TeacherCoursesStore.setStudentGrade(enrollmentId, studentId, grade);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to set student grade"
      };
    }
  }
}

export default new TeacherCourseController();
