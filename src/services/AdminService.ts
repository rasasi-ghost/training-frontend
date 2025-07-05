import ApiService from "./ApiService";

export enum UserRole {
  Admin = 0,
  Teacher = 1,
  Student = 2
}

export enum TeacherApprovalStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export interface AdminUser extends User {
  isSuperAdmin: boolean;
}

export interface Teacher extends User {
  department?: string;
  qualification?: string;
  approvalStatus: TeacherApprovalStatus;
}

export interface Student extends User {
  studentId: string;
  year: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  displayName?: string;
  role: UserRole;
  isSuperAdmin?: boolean;
  department?: string;
  qualification?: string;
  studentId?: string;
  year?: number;
}

export interface UpdateRoleRequest {
  role: UserRole;
}

class AdminService {
  // User management
  public async getAllUsers(): Promise<User[]> {
    return ApiService.get<User[]>("/admin/users");
  }

  public async getUser(userId: string): Promise<User> {
    return ApiService.get<User>(`/admin/users/${userId}`);
  }

  public async createUser(userData: CreateUserRequest): Promise<User> {
    return ApiService.post<User>("/admin/users", userData);
  }

  public async updateUserRole(userId: string, roleData: UpdateRoleRequest): Promise<User> {
    return ApiService.put<User>(`/admin/users/${userId}/role`, roleData);
  }

  public async deleteUser(userId: string): Promise<{message: string}> {
    return ApiService.delete<{message: string}>(`/admin/users/${userId}`);
  }

  // Teacher approval management
  public async getPendingTeachers(): Promise<Teacher[]> {
    return ApiService.get<Teacher[]>("/admin/pending-teachers");
  }

  public async approveTeacher(teacherId: string): Promise<{message: string}> {
    return ApiService.put<{message: string}>(`/admin/teachers/${teacherId}/approve`, {});
  }

  public async rejectTeacher(teacherId: string): Promise<{message: string}> {
    return ApiService.put<{message: string}>(`/admin/teachers/${teacherId}/reject`, {});
  }
}

export default new AdminService();
