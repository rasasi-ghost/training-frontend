import MyCoursesStore from "../state/MyCoursesStore";
import { Course } from "../services/CourseService";

class CoursesController {
  private coursesStore = MyCoursesStore;

  async loadDashboardData() {
    return this.coursesStore.loadAllCourseData();
  }

  async enrollInCourse(courseId: string) {
    return this.coursesStore.enrollInCourse(courseId);
  }

  get pendingCourses() {
    return this.coursesStore.pendingCourses;
  }

  get approvedCourses() {
    return this.coursesStore.approvedCourses;
  }

  get completedCourses() {
    return this.coursesStore.completedCourses;
  }

  get availableCoursesCount() {
    return this.coursesStore.availableCoursesCount;
  }

  get pendingEnrollments() {
    return this.coursesStore.pendingEnrollments;
  }

  get approvedEnrollments() {
    return this.coursesStore.approvedEnrollments;
  }

  get completedEnrollments() {
    return this.coursesStore.completedEnrollments;
  }

  getEnrollmentForCourse(courseId: string) {
    return this.coursesStore.enrollments.find(e => e.courseId === courseId);
  }

  get isLoading() {
    return (
      this.coursesStore.loadingAvailable || 
      this.coursesStore.loadingEnrollments || 
      this.coursesStore.loadingEnrolled
    );
  }
}

export default new CoursesController();
