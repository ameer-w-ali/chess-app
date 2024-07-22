import CreateRoom from "@/components/createRoom";
import JoinRoom from "@/components/joinRoom";

export default function page() {
  return (
    <main className="h-svh w-auto bg-center bg-cover bg-no-repeat bg-hero-image">
      <div className="h-full w-full backdrop-brightness-50 grid place-items-center">
        <div className="bg-neutral-900/75 p-8 rounded-md">
          <h2 className="text-7xl font-bold text-center text-lime-600">
            CHESS ROOM
          </h2>
          <div className="flex justify-around mt-12 items-center">
            <CreateRoom />
            <JoinRoom />
          </div>
        </div>
      </div>
    </main>
  );
}
