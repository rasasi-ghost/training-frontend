import { User } from "../types/user";

const USER_KEY = "training_app_user";
const TOKEN_KEY = "training_app_token";

export class LocalStorageService {
  static getUser(): User | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        return null;
      }
    }
    return null;
  }

  static setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  static clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  static clearAll(): void {
    this.clearUser();
    this.clearToken();
  }
}
