import { api } from "@/lib/api";

export class SmsService {
  static async schedule(data: { recipients: string; messageBody: string; campaignName?: string; runAt: string }) {
    const res = await api.post("/sms/scheduled", data);
    return res.data.data;
  }

  static async sendSingle(data: { recipient: string; messageBody: string }) {
    const res = await api.post("/sms/single", data);
    return res.data.data;
  }

  static async sendBulk(data: {
    campaignName?: string;
    recipients: string;
    messageBody: string;
  }) {
    const res = await api.post("/sms/bulk", data);
    return res.data.data;
  }

  static async getCampaigns(page = 1, limit = 20) {
    const res = await api.get("/sms/campaigns", { params: { page, limit } });
    return res.data.data;
  }

  static async getCampaign(id: string) {
    const res = await api.get(`/sms/campaigns/${id}`);
    return res.data.data.campaign;
  }

  static async getCampaignJobs(id: string, page = 1, limit = 50) {
    const res = await api.get(`/sms/campaigns/${id}/jobs`, { params: { page, limit } });
    return res.data.data;
  }

  static async cancelCampaign(id: string) {
    const res = await api.post(`/sms/campaigns/${id}/cancel`);
    return res.data.data;
  }

  /* ---------- Inbox (Incoming SMS) ---------- */
  static async getInbox(page = 1, limit = 20) {
    const res = await api.get("/sms/inbox", { params: { page, limit } });
    return res.data.data;
  }

  static async getInboxUnread() {
    const res = await api.get("/sms/inbox/unread-count");
    return res.data.data.unread as number;
  }

  static async markInboxRead(id: string) {
    const res = await api.post(`/sms/inbox/${id}/read`);
    return res.data;
  }

  static async markAllInboxRead() {
    const res = await api.post("/sms/inbox/read-all");
    return res.data;
  }
}