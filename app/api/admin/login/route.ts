import { checkAdminCredentials, createSessionCookie } from "../../../admin/auth";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { username?: string; password?: string };
    const username = payload.username?.trim() ?? "";
    const password = payload.password?.trim() ?? "";

    if (!checkAdminCredentials(username, password)) {
      return Response.json({ error: "Incorrect username or password." }, { status: 401 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await createSessionCookie(),
      },
    });
  } catch {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
