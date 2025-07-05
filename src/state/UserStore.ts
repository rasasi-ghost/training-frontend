import { makeAutoObservable } from "mobx";
import { User, UserRole } from "../types/user";
import { LocalStorageService } from "../services/LocalStorageService";

class UserStore {
  currentUser: User | null = null;
  isAuthenticated: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    try {
      const storedUser = LocalStorageService.getUser();
      if (storedUser) {
        this.currentUser = storedUser;
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error("Error initializing user from storage:", error);
    }
  }

  setUser(user: User | null) {
    this.currentUser = user;
    this.isAuthenticated = !!user;
    console.log(user)

    if (user) {
      LocalStorageService.setUser(user);
    } else {
      LocalStorageService.clearUser();
    }
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  clearError() {
    this.error = null;
  }

  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    LocalStorageService.clearAll();
  }

  get userRole(): UserRole | null {
    return this.currentUser?.role || null;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role.toString() === "0";
  }

  get isTeacher(): boolean {
    return this.currentUser?.role .toString() === "1"
  }

  get isStudent(): boolean {
    return this.currentUser?.role.toString() === "2"
  }

  get displayName(): string {
    return this.currentUser?.displayName || "User";
  }

  get dashboardRoute(): string {
    console.log("Current user role:", this.isTeacher);

    if (this.isAdmin) return "/admin-dashboard";
    if (this.isTeacher) return "/teacher-dashboard";
    if (this.isStudent) return "/dashboard-overview-7";
    return "/login";
  }
}

export default new UserStore();
