import MyCoursesStore from './MyCoursesStore';
import UserStore from './UserStore';
import AdminUsecasesStore from './AdminUsecasesStore';

class RootStore {
  userStore = UserStore;
  myCoursesStore = MyCoursesStore;
  adminUsecasesStore = AdminUsecasesStore;
  
  // Add other stores as needed
  // courseStore = new CourseStore();
  // notificationStore = new NotificationStore();
}

export default new RootStore();
