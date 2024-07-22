const rooms = new Map<string, { player: Set<WebSocket> }>();

export async function POST(){
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    rooms.set(code,{player:new Set()});
    return Response.json({
      code:code
    })
  } catch (error) {
    return Response.error()
  }
}
