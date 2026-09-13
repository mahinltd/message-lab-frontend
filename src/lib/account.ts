import { api } from "@/lib/api";

export class AccountService {
  static async listApiKeys() {
    const res = await api.get("/developer/api-keys");
    return res.data.data.credentials;
  }

  static async createApiKey(name: string) {
    const res = await api.post("/developer/api-keys", { name });
    return res.data.data;
  }

  static async revokeApiKey(credentialId: string) {
    const res = await api.delete(`/developer/api-keys/${credentialId}`);
    return res.data;
  }

  static async getDeveloperUsage() {
    const res = await api.get("/developer/usage");
    return res.data.data;
  }

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

  static async requestEmailChange(email: string) {
    const res = await api.post("/auth/email-change/request", { email });
    return res.data;
  }

  static async confirmEmailChange(token: string) {
    const res = await api.post("/auth/email-change/confirm", { token });
    return res.data.data;
  }

  static async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append("profileImage", file);
    const res = await api.post("/auth/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  }
}