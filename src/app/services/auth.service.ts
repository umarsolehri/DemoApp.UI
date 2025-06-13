import { httpService } from './http.service';
import { LoginRequest, LoginResponse } from '../types/api.types';

class AuthService {
  private static instance: AuthService;
  private isAuthenticated: boolean = false;
  private userRoles: string[] = [];

  private constructor() {
    // Initialize authentication state only on client side
    if (typeof window !== 'undefined') {
      this.isAuthenticated = !!httpService['token'];
      this.userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await httpService.post<LoginResponse>('/auth/login', {
        username: credentials.username,
        password: credentials.password
      });
      const { token, username, roles } = response.data;
      
      // Store the token and user info only on client side
      if (typeof window !== 'undefined') {
        httpService.setToken(token);
        localStorage.setItem('username', username);
        localStorage.setItem('userRoles', JSON.stringify(roles));
        this.userRoles = roles;
        this.isAuthenticated = true;
      }
      
      return response.data;
    } catch (error) {
      this.isAuthenticated = false;
      throw error;
    }
  }

  public logout(): void {
    if (typeof window !== 'undefined') {
      httpService.setToken(null);
      localStorage.removeItem('username');
      localStorage.removeItem('userRoles');
      this.userRoles = [];
      this.isAuthenticated = false;
    }
  }

  public isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  public getToken(): string | null {
    return httpService['token'];
  }

  public getUsername(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('username');
    }
    return null;
  }

  public getUserRoles(): string[] {
    return this.userRoles;
  }

  public isAdmin(): boolean {
    return this.userRoles.includes('Admin');
  }
}

export const authService = AuthService.getInstance(); 