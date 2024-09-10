import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  let accessTokenResponse;
  let userData;

  // Exchange Google authorization code for access token
  accessTokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    }),
  });

  const data = await accessTokenResponse.json();

  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  // Fetch user info from Google
  const userResponse = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    }
  );
  userData = await userResponse.json();

  // Redirect user with profile info (name, email)
  const redirectUrl = new URL("/login", process.env.NEXT_PUBLIC_BASE_URL);
  redirectUrl.searchParams.append("username", userData.name || userData.login);
  redirectUrl.searchParams.append("email", userData.email);
  redirectUrl.searchParams.append("provider", "GOOGLE");

  return NextResponse.redirect(redirectUrl.toString());
}
