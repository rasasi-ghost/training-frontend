import { makeAutoObservable, runInAction } from "mobx";
import AdminService, {
  User,
  Teacher,
  UserRole,
  CreateUserRequest,
  UpdateRoleRequest
} from "../services/AdminService";

class AdminUsecasesStore {
  users: User[] = [];
  selectedUser: User | null = null;
  pendingTeachers: Teacher[] = [];
  loading: boolean = false;
  error: string | null = null;
  openCreateUserModal: boolean = false; // New flag to open create user modal from main dashboard

  constructor() {
    makeAutoObservable(this);
  }

  // Reset states
  reset() {
    this.users = [];
    this.selectedUser = null;
    this.pendingTeachers = [];
    this.loading = false;
    this.error = null;
    this.openCreateUserModal = false;
  }

  // Error handling
  setError(error: string | null) {
    this.error = error;
  }

  // User management
  async fetchAllUsers() {
    this.loading = true;
    this.error = null;
    try {
      const users = await AdminService.getAllUsers();
      runInAction(() => {
        this.users = users;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to fetch users";
        this.loading = false;
      });
    }
  }

  async fetchUser(userId: string) {
    this.loading = true;
    this.error = null;
    try {
      const user = await AdminService.getUser(userId);
      runInAction(() => {
        this.selectedUser = user;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to fetch user details";
        this.loading = false;
      });
    }
  }

  async createUser(userData: CreateUserRequest) {
    this.loading = true;
    this.error = null;
    try {
      const user = await AdminService.createUser(userData);
      runInAction(() => {
        this.users.push(user);
        this.loading = false;
      });
      return user.id;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to create user";
        this.loading = false;
      });
      throw error;
    }
  }

  async updateUserRole(userId: string, roleData: UpdateRoleRequest) {
    this.loading = true;
    this.error = null;
    try {
      const updatedUser = await AdminService.updateUserRole(userId, roleData);
      runInAction(() => {
        this.users = this.users.map(user => 
          user.id === userId ? updatedUser : user
        );
        if (this.selectedUser?.id === userId) {
          this.selectedUser = updatedUser;
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to update user role";
        this.loading = false;
      });
      throw error;
    }
  }

  async deleteUser(userId: string) {
    this.loading = true;
    this.error = null;
    try {
      await AdminService.deleteUser(userId);
      runInAction(() => {
        this.users = this.users.filter(user => user.id !== userId);
        if (this.selectedUser?.id === userId) {
          this.selectedUser = null;
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to delete user";
        this.loading = false;
      });
      throw error;
    }
  }

  // Teacher approval management
  async fetchPendingTeachers() {
    this.loading = true;
    this.error = null;
    try {
      const teachers = await AdminService.getPendingTeachers();
      runInAction(() => {
        this.pendingTeachers = teachers;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to fetch pending teachers";
        this.loading = false;
      });
    }
  }

  async approveTeacher(teacherId: string) {
    this.loading = true;
    this.error = null;
    try {
      await AdminService.approveTeacher(teacherId);
      runInAction(() => {
        this.pendingTeachers = this.pendingTeachers.filter(
          teacher => teacher.id !== teacherId
        );
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to approve teacher";
        this.loading = false;
      });
      throw error;
    }
  }

  async rejectTeacher(teacherId: string) {
    this.loading = true;
    this.error = null;
    try {
      await AdminService.rejectTeacher(teacherId);
      runInAction(() => {
        this.pendingTeachers = this.pendingTeachers.filter(
          teacher => teacher.id !== teacherId
        );
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Failed to reject teacher";
        this.loading = false;
      });
      throw error;
    }
  }
}

export default new AdminUsecasesStore();
