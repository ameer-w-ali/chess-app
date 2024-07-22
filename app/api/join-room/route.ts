import { NextRequest } from "next/server";

const rooms = new Map<string, { players: Set<WebSocket> }>();

export default function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  try {
    if (rooms.has(code as string)) {
      return Response.json({ valid: true });
    }
    return Response.json({ valid: false });
  } catch (error) {
    return Response.error();
  }
}
