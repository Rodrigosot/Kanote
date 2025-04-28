import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';
// GET /api/auth/[kindeAuth] - Get the current user session
// This route is protected by the Kinde Auth middleware
export const GET = handleAuth();
