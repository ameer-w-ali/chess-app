import Chess from "@/components/chess";
import useWebSocket from "@/hooks/useWebSocket";
import { INIT, Message, Status } from "@/lib/message";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Room() {
  const params = useParams();
  const code = params.slug
  
  const [messages, status, sendMessage] = useWebSocket(code as string);

  useEffect(() => {
    const message: Message = {
      type: INIT,
      payload: {
        message: "start",
      },
    };
    sendMessage(message);
  }, []);

  if (status === Status.NOT_STARTED)
    return (
      <div className="grid h-screen place-items-center bg-neutral-900">
        <div className="grid place-items-center">
        <div className="text-white text-center mb-3">Waiting for Opponent</div>
          <div className="flex space-x-2">
            {code && code.split("").map((digit, index) => (
              <div
                key={index}
                className="border rounded bg-neutral-700/80 text-neutral-100 text-lg font-semibold aspect-square h-8 grid place-items-center"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex max-sm:items-center h-dvh sm:px-12 sm:py-4 sm:space-x-2 bg-neutral-900">
      <Chess messages={messages} sendMessage={sendMessage} />
      <div className="hidden sm:w-1/2 sm:flex flex-col space-y-4">
        <div className="bg-neutral-600 h-1/2 rounded"></div>
        <div className="bg-neutral-600 h-1/2 rounded"></div>
      </div>
    </div>
  );
}
