import { api } from "@/lib/api";
import { AuthResponse, RegisterInput, LoginInput } from "@/types";

export class AuthService {
  static async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post("/auth/register", data);
    return response.data;
  }

  static async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post("/auth/login", data);
    return response.data;
  }

  static async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await api.post("/auth/google", { idToken });
    return response.data;
  }

  static async verifyEmail(token: string) {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  }

  static async resendVerification(email: string) {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
  }

  static async forgotPassword(email: string) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  }

  static async resetPassword(token: string, newPassword: string) {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  }

  static async logout(): Promise<void> {
    await api.post("/auth/logout");
  }
}