import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  Auth
} from "firebase/auth";
import ApiService from "./ApiService";
import { LoginResponse } from "../types/user";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoubDFAXD7JP2lrK6B-jayn9AkpxBAYvU",
  authDomain: "anawow-app.firebaseapp.com",  // Only these two fields are strictly required for Firebase Auth
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

export class AuthService {
  // Firebase authentication
  static async firebaseLogin(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  static async firebaseRegisterStudent(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  static async logout(): Promise<void> {
    return signOut(auth);
  }

  // Backend authentication
  static async backendLogin(idToken: string): Promise<LoginResponse> {
    return ApiService.post<LoginResponse>("/auth/login", { idToken });
  }

  static async backendAdminLogin(idToken: string, adminCode: string): Promise<LoginResponse> {
    return ApiService.post<LoginResponse>("/auth/admin/login", { idToken, adminCode });
  }

  static async validateToken(token: string): Promise<boolean> {
    try {
      // This endpoint would verify the token on your backend
      await ApiService.post("/auth/verify-token", { token });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async registerStudent(email: string, password: string, displayName: string, year: number): Promise<any> {
    return ApiService.post("/auth/register/student", {
      email,
      password,
      displayName,
      year
    });
  }

  static async registerTeacher(
    email: string, 
    password: string, 
    displayName: string, 
    department: string, 
    qualification: string
  ): Promise<any> {
    return ApiService.post("/auth/register/teacher", {
      email,
      password,
      displayName,
      department,
      qualification
    });
  }
}
