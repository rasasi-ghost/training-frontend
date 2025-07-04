export enum UserRole {
  Admin = "Admin",
  Teacher = "Teacher",
  Student = "Student"
}

export interface BaseUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
}

export interface Student extends BaseUser {
  role: UserRole.Student;
  studentId: string;
  year: number;
}

export interface Teacher extends BaseUser {
  role: UserRole.Teacher;
  department: string;
  qualification: string;
}

export interface Admin extends BaseUser {
  role: UserRole.Admin;
}

export type User = Student | Teacher | Admin;

export interface LoginResponse {
  user: User;
  role: string;
  isAdmin?: boolean;
}
