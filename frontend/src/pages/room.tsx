import Chess from "@/components/chess";
import Ledger from "@/components/ledger";
import useWebSocket from "@/hooks/useWebSocket";
import { INIT, Message, Status } from "common";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Room() {
  const params = useParams();
  const code = params.slug;

  const [messages, status, ping, sendMessage] = useWebSocket(code as string);

  useEffect(() => {
    if (status === Status.NOT_STARTED) {
      const message: Message = {
        type: INIT,
        payload: {
          message: "start",
        },
      };
      sendMessage(message);
    }
  }, []);

  if (status === Status.NOT_STARTED)
    return (
      <div className="grid h-screen place-items-center bg-neutral-100 dark:bg-neutral-900">
        <div className="grid place-items-center">
          <div className="dark:text-white text-center mb-3">
            Waiting for Opponent
          </div>
          <div className="flex space-x-2">
            {code &&
              code.split("").map((digit, index) => (
                <div
                  key={index}
                  className="border rounded bg-neutral-300/80 dark:bg-neutral-700/80 text-neutral-900 dark:text-neutral-50 text-lg font-semibold aspect-square h-8 grid place-items-center"
                >
                  {digit}
                </div>
              ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="grid md:grid-cols-8 md:grid-rows-3 gap-4 md:h-dvh sm:p-4 bg-neutral-300 dark:bg-neutral-900">
      <Chess ping={ping} messages={messages} sendMessage={sendMessage} />
      <Ledger messages={messages} />
      <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg md:row-span-1 md:col-span-5">
        hello
      </div>
    </div>
  );
}
