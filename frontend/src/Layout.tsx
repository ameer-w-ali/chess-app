import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { ModeToggle } from "./components/mode-toggle";

export default function Layout() {
  return (
    <main>
      <ModeToggle />
      <Outlet />
      <Toaster />
    </main>
  );
}