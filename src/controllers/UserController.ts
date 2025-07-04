import { AuthService } from "../services/AuthService";
import UserStore from "../state/UserStore";
import { LocalStorageService } from "../services/LocalStorageService";
import ApiService from "../services/ApiService";
import { UserRole } from "../types/user";
import { User } from "@/fakers/users";


class UserController {
  // Authentication methods

  async login(email: string, password: string): Promise<any> {
    try {

      UserStore.setLoading(true);
      UserStore.clearError();

      // 1. Login with Firebase
      const firebaseResponse = await AuthService.firebaseLogin(email, password);

      // 2. Get the Firebase token
      const token = await firebaseResponse.user.getIdToken();

      // 3. Login with backend
      const userData = await AuthService.backendLogin(token);

      // 4. Store token
      LocalStorageService.setToken(token);

      // 5. Update store with user data
      UserStore.setUser(userData.user);

      return userData;
    } catch (error) {
      let errorMessage = "Login failed. Please check your credentials.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      UserStore.setError(errorMessage);
      throw error;
    } finally {
      UserStore.setLoading(false);
    }
  }

  async logout(): Promise<void> {
    try {
      UserStore.setLoading(true);
      await AuthService.logout();
      UserStore.logout();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      UserStore.setLoading(false);
    }
  }

  async registerStudent(
    email: string,
    password: string,
    displayName: string,
    year: number
  ): Promise<any> {
    try {
      UserStore.setLoading(true);
      UserStore.clearError();

      // Register the student with backend
      await AuthService.registerStudent(email, password, displayName, year);

      // Auto login after registration
      return this.login(email, password);
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      UserStore.setError(errorMessage);
      throw error;
    } finally {
      UserStore.setLoading(false);
    }
  }

  async registerTeacher(
    email: string,
    password: string,
    displayName: string,
    department: string,
    qualification: string
  ): Promise<any> {
    try {
      UserStore.setLoading(true);
      UserStore.clearError();

      // Register the teacher with backend
      await AuthService.registerTeacher(
        email,
        password,
        displayName,
        department,
        qualification
      );

      // Note: Teachers might need approval, so we don't auto-login

      return { success: true, message: "Registration successful. Your account is pending approval." };
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      UserStore.setError(errorMessage);
      throw error;
    } finally {
      UserStore.setLoading(false);
    }
  }

  // User profile methods
  async getUserProfile(): Promise<void> {
    try {
      UserStore.setLoading(true);

      const userId = UserStore.currentUser?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const userProfile: any = await ApiService.get(`/users/${userId}`);
      UserStore.setUser(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    } finally {
      UserStore.setLoading(false);
    }
  }

  async updateUserProfile(profileData: Partial<any>): Promise<void> {
    try {
      UserStore.setLoading(true);

      const userId = UserStore.currentUser?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const updatedProfile: any = await ApiService.put(`/users/${userId}`, profileData);
      UserStore.setUser(updatedProfile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    } finally {
      UserStore.setLoading(false);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      UserStore.setLoading(true);

      // Implement your password change logic here
      // This would typically involve Firebase and possibly your backend

      // Example (implement according to your Firebase setup):
      // await AuthService.changePassword(currentPassword, newPassword);

    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    } finally {
      UserStore.setLoading(false);
    }
  }

  // Admin-specific methods
  async getAllUsers() {
    if (UserStore.userRole !== UserRole.Admin) {
      throw new Error("Unauthorized access");
    }

    try {
      return await ApiService.get('/users');
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async approveTeacher(teacherId: string) {
    if (UserStore.userRole !== UserRole.Admin) {
      throw new Error("Unauthorized access");
    }

    try {
      return await ApiService.put(`/users/teachers/${teacherId}/approve`);
    } catch (error) {
      console.error("Error approving teacher:", error);
      throw error;
    }
  }

  // Session management
  validateSession(): boolean {
    const token = LocalStorageService.getToken();
    const user = UserStore.currentUser;

    return !!(token && user);
  }

  getRedirectPathForRole(): string {
    return UserStore.dashboardRoute;
  }

  // For handling user roles and access
  canAccessResource(requiredRoles: UserRole[]): boolean {
    const userRole = UserStore.userRole;
    return userRole !== null && requiredRoles.includes(userRole);
  }
}

export default new UserController();
