import UserStore from './UserStore';

class RootStore {
  userStore = UserStore;
  
  // Add other stores as needed
  // courseStore = new CourseStore();
  // notificationStore = new NotificationStore();
}

export default new RootStore();
