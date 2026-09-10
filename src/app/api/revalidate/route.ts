import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { secret?: string };
    let authorized = Boolean(process.env.REVALIDATE_SECRET && body.secret === process.env.REVALIDATE_SECRET);
    const authorization = request.headers.get("authorization");
    if (!authorized && authorization) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auth/me`, { headers: { Authorization: authorization } });
      if (response.ok) {
        const payload = await response.json() as { data?: { user?: { role?: string } } };
        authorized = payload.data?.user?.role === "admin";
      }
    }
    if (!authorized) {
      return Response.json({ revalidated: false }, { status: 401 });
    }

    revalidateTag("public-content", "max");
    ["/", "/about", "/blog", "/contact", "/help", "/docs", "/status", "/support", "/privacy", "/terms", "/anti-spam", "/llms.txt", "/llms-full.txt"].forEach((path) => revalidatePath(path));
    return Response.json({ revalidated: true });
  } catch {
    return Response.json({ revalidated: false }, { status: 400 });
  }
}