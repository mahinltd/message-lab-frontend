export const siteConfig = {
  name: "Messages Lab",
  description:
    "Turn your Android phone into a personal SMS gateway. Send, receive, and manage SMS through your own device.",
  url: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  apiURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  links: {
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    pricing: "/pricing",
    admin: "/admin",
  },
} as const;
