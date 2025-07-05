import { makeAutoObservable } from "mobx";
import myCoursesStore, { MyCoursesStore } from "../state/MyCoursesStore";
import { Course, Enrollment } from "../services/CourseService";
import { Console } from "console";

class CoursesController {
  constructor(private store: MyCoursesStore) {
    makeAutoObservable(this);
  }

  get isLoading(): boolean {
    return this.store.loadingAvailable || 
           this.store.loadingEnrollments || 
           this.store.loadingEnrolled;
  }

  get pendingCourses(): Course[] {
    console.log(this.store.pendingCourses);
    return this.store.pendingCourses;
  }

  get pendingEnrollment(): Enrollment[] {
    console.log(this.store.pendingEnrollments);
    return this.store.pendingEnrollments;
  }


  get approvedCourses(): Course[] {
    return this.store.approvedCourses;
  }

  get completedCourses(): Course[] {
    return this.store.completedCourses;
  }

  get availableCourses(): Course[] {
    return this.store.availableCourses;
  }

  get availableCoursesCount(): number {
    return this.store.availableCoursesCount;
  }

  isCourseEnrolled(courseId: string): boolean {
    return this.store.enrollments.some(e => e.courseId === courseId);
  }

  getEnrollmentForCourse(courseId: string): Enrollment | undefined {
    return this.store.enrollments.find(e => e.courseId === courseId);
  }

  async loadDashboardData(): Promise<void> {
    await this.store.loadAllCourseData();
  }

  async enrollInCourse(courseId: string): Promise<boolean> {
    return await this.store.enrollInCourse(courseId);
  }
}

export default new CoursesController(myCoursesStore);
