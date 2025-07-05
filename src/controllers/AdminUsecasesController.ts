import AdminUsecasesStore from "../state/AdminUsecasesStore";
import { User, Teacher, CreateUserRequest, UpdateRoleRequest } from "../services/AdminService";

class AdminUsecasesController {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<{ success: boolean; users?: User[]; error?: string }> {
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

  /**
   * Get a specific user by ID
   */
  async getUser(userId: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      await AdminUsecasesStore.fetchUser(userId);
      return {
        success: true,
        user: AdminUsecasesStore.selectedUser || undefined
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user details"
      };
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<{ success: boolean; userId?: string; error?: string }> {
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

  /**
   * Update a user's role
   */
  async updateUserRole(userId: string, roleData: UpdateRoleRequest): Promise<{ success: boolean; error?: string }> {
    try {
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

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
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

  /**
   * Get pending teacher applications
   */
  async getPendingTeachers(): Promise<{ success: boolean; teachers?: Teacher[]; error?: string }> {
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

  /**
   * Approve a teacher application
   */
  async approveTeacher(teacherId: string): Promise<{ success: boolean; error?: string }> {
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

  /**
   * Reject a teacher application
   */
  async rejectTeacher(teacherId: string): Promise<{ success: boolean; error?: string }> {
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
