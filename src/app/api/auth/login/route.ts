import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { timingSafeEqual } from "node:crypto";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const expectedPassword = process.env.APP_ACCESS_PASSWORD;
    const sessionSecret = process.env.APP_SESSION_SECRET;

    if (!expectedPassword || !sessionSecret) {
      return NextResponse.json(
        { error: "Server nije pravilno podešen." },
        { status: 500 },
      );
    }

    const submitted = Buffer.from(typeof password === "string" ? password : "");
    const expected = Buffer.from(expectedPassword);

    const valid =
      submitted.length === expected.length &&
      timingSafeEqual(submitted, expected);

    if (!valid) {
      return NextResponse.json({ error: "Pogrešna lozinka." }, { status: 401 });
    }

    const secret = new TextEncoder().encode(sessionSecret);

    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({ success: true });

    response.cookies.set("rileflow_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Greška prilikom prijave." },
      { status: 400 },
    );
  }
}
