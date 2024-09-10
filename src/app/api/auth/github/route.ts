import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  // Exchange the authorization code for an access token
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  // Fetch user info using access_token
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${data.access_token}`,
    },
  });

  const userData = await userResponse.json();

  // Ensure you use a valid protocol and domain in the redirect URL
  const redirectUrl = new URL("/login", process.env.NEXT_PUBLIC_BASE_URL); // Update BASE_URL accordingly
  redirectUrl.searchParams.append("username", userData.login);
  redirectUrl.searchParams.append("email", userData.email);
  redirectUrl.searchParams.append("provider", "GITHUB");

  return NextResponse.redirect(redirectUrl.toString());
}
