import AdminUsecasesStore from "../state/AdminUsecasesStore";
import AdminService, {
  CreateUserRequest,
  UpdateRoleRequest,
  UserRole
} from "../services/AdminService";

class AdminUsecasesController {
  // User management
  async getAllUsers() {
    try {
      await AdminUsecasesStore.fetchAllUsers();
      return {
        success: true,
        users: AdminUsecasesStore.users
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch users"
      };
    }
  }

  async getUserDetails(userId: string) {
    try {
      await AdminUsecasesStore.fetchUser(userId);
      return {
        success: true,
        user: AdminUsecasesStore.selectedUser
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user details"
      };
    }
  }

  async createUser(userData: CreateUserRequest) {
    try {
      const userId = await AdminUsecasesStore.createUser(userData);
      return {
        success: true,
        userId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create user"
      };
    }
  }

  async updateUserRole(userId: string, role: UserRole) {
    try {
      const roleData: UpdateRoleRequest = { role };
      await AdminUsecasesStore.updateUserRole(userId, roleData);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update user role"
      };
    }
  }

  async deleteUser(userId: string) {
    try {
      await AdminUsecasesStore.deleteUser(userId);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete user"
      };
    }
  }

  // Teacher approval management
  async getPendingTeachers() {
    try {
      await AdminUsecasesStore.fetchPendingTeachers();
      return {
        success: true,
        teachers: AdminUsecasesStore.pendingTeachers
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch pending teachers"
      };
    }
  }

  async approveTeacher(teacherId: string) {
    try {
      await AdminUsecasesStore.approveTeacher(teacherId);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to approve teacher"
      };
    }
  }

  async rejectTeacher(teacherId: string) {
    try {
      await AdminUsecasesStore.rejectTeacher(teacherId);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to reject teacher"
      };
    }
  }
}

export default new AdminUsecasesController();
