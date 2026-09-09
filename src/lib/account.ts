import { api } from "@/lib/api";

export class AccountService {
  static async updateProfile(data: { name?: string; mobile?: string }) {
    const res = await api.put("/auth/profile", data);
    return res.data.data;
  }

  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    const res = await api.put("/auth/change-password", data);
    return res.data;
  }
}