import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

// GET /api/user - Get the current user session
// This route is protected by the Kinde Auth middleware
export async function GET() {
  const { getUser } = getKindeServerSession();

  const data = await getUser();

  return NextResponse.json(data);
}

