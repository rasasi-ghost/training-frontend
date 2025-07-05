import { makeAutoObservable, runInAction } from "mobx";
import CourseService, { Course, Enrollment } from "../services/CourseService";

export class MyCoursesStore {
  availableCourses: Course[] = [];
  enrollments: Enrollment[] = [];
  enrolledCourses: Course[] = [];
  
  loadingAvailable: boolean = false;
  loadingEnrollments: boolean = false;
  loadingEnrolled: boolean = false;
  
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get pendingEnrollments(): Enrollment[] {
    var s = this.enrollments.filter(enrollment => enrollment.statusString === "Pending");
    // alert("Pending enrollments: " + s.length);

    return s ; 
  }

  get approvedEnrollments(): Enrollment[] {
    var s =  this.enrollments.filter(enrollment => enrollment.statusString === "Approved");
    // console.log(this.enrollments.at(0)?.statusString);
    return s;
  }

  get completedEnrollments(): Enrollment[] {
    return this.enrollments.filter(enrollment => enrollment.statusString === "Completed");
  }

  get pendingCourses(): Course[] {
    const pendingCourseIds = this.pendingEnrollments.map(e => e.courseId);
    return this.enrolledCourses.filter(course => pendingCourseIds.includes(course.id));
  }

  get approvedCourses(): Course[] {
    const approvedCourseIds = this.approvedEnrollments.map(e => e.courseId);
    return this.enrolledCourses.filter(course => approvedCourseIds.includes(course.id));
  }

  get completedCourses(): Course[] {
    const completedCourseIds = this.completedEnrollments.map(e => e.courseId);
    return this.enrolledCourses.filter(course => completedCourseIds.includes(course.id));
  }

  get availableCoursesCount(): number {
    return this.availableCourses.length;
  }

  async fetchAvailableCourses() {
    this.loadingAvailable = true;
    this.error = null;
    
    try {
      const courses = await CourseService.getAvailableCourses();
      runInAction(() => {
        this.availableCourses = courses;
        this.loadingAvailable = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to fetch available courses";
        this.loadingAvailable = false;
      });
    }
  }

  async fetchEnrollments() {
    this.loadingEnrollments = true;
    this.error = null;
    
    try {
      const enrollments = await CourseService.getStudentEnrollments();
      runInAction(() => {
        this.enrollments = enrollments;
        this.loadingEnrollments = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to fetch enrollments";
        this.loadingEnrollments = false;
      });
    }
  }

  async fetchEnrolledCourses() {
    this.loadingEnrolled = true;
    this.error = null;
    
    try {
      const courses = await CourseService.getEnrolledCourses();
      runInAction(() => {
        this.enrolledCourses = courses;
        this.loadingEnrolled = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to fetch enrolled courses";
        this.loadingEnrolled = false;
      });
    }
  }

  async enrollInCourse(courseId: string) {
    try {
      await CourseService.enrollInCourse(courseId);
      // Refresh data after enrollment
      await this.fetchEnrollments();
      await this.fetchEnrolledCourses();
      return true;
    } catch (error) {
      console.log("Enrollment error:", error);
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "You might be aleready enrolled in this course or the course is not available.";
      });
      return false;
    }
  }

  async loadAllCourseData() {
    await Promise.all([
      this.fetchAvailableCourses(),
      this.fetchEnrollments(),
      this.fetchEnrolledCourses()
    ]);
  }
}

export default new MyCoursesStore();
