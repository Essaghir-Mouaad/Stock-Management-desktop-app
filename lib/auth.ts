// // lib/auth.ts
// import { invoke } from '@tauri-apps/api/tauri';

// export interface User {
//   id: string;
//   username: string;
//   email?: string;
//   name?: string;
//   role: string;
// }

// export interface LoginRequest {
//   username: string;
//   password: string;
// }

// export interface RegisterRequest {
//   username: string;
//   email?: string;
//   password: string;
//   name?: string;
//   role?: string;
// }

// export interface AuthResponse {
//   success: boolean;
//   message: string;
//   token?: string;
//   user?: User;
// }

// export interface BasicResponse {
//   success: boolean;
//   message: string;
// }

// // Auth service using Tauri invoke
// export class AuthService {
//   private static TOKEN_KEY = 'auth_token';
  
//   // Login user
//   static async login(credentials: LoginRequest): Promise<AuthResponse> {
//     try {
//       const response = await invoke<AuthResponse>('login_user', {
//         request: credentials
//       });
      
//       if (response.success && response.token) {
//         localStorage.setItem(this.TOKEN_KEY, response.token);
//       }
      
//       return response;
//     } catch (error) {
//       console.error('Login error:', error);
//       return {
//         success: false,
//         message: 'Login failed: ' + String(error)
//       };
//     }
//   }
  
//   // Register user
//   static async register(userData: RegisterRequest): Promise<AuthResponse> {
//     try {
//       const response = await invoke<AuthResponse>('register_user', {
//         request: userData
//       });
      
//       return response;
//     } catch (error) {
//       console.error('Registration error:', error);
//       return {
//         success: false,
//         message: 'Registration failed: ' + String(error)
//       };
//     }
//   }
  
//   // Logout user
//   static async logout(): Promise<BasicResponse> {
//     try {
//       const response = await invoke<BasicResponse>('logout_user');
//       localStorage.removeItem(this.TOKEN_KEY);
//       return response;
//     } catch (error) {
//       console.error('Logout error:', error);
//       localStorage.removeItem(this.TOKEN_KEY);
//       return {
//         success: true,
//         message: 'Logged out locally'
//       };
//     }
//   }
  
//   // Verify token
//   static async verifyToken(): Promise<AuthResponse | null> {
//     try {
//       const token = localStorage.getItem(this.TOKEN_KEY);
//       if (!token) {
//         return null;
//       }
      
//       const response = await invoke<AuthResponse>('verify_token', {
//         token
//       });
      
//       if (!response.success) {
//         localStorage.removeItem(this.TOKEN_KEY);
//       }
      
//       return response;
//     } catch (error) {
//       console.error('Token verification error:', error);
//       localStorage.removeItem(this.TOKEN_KEY);
//       return null;
//     }
//   }
  
//   // Get stored token
//   static getToken(): string | null {
//     return localStorage.getItem(this.TOKEN_KEY);
//   }
  
//   // Check if user is authenticated
//   static isAuthenticated(): boolean {
//     return !!this.getToken();
//   }
// }