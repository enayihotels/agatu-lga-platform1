import { Outlet } from "react-router-dom";

import NavBar from "@/components/NavBar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-agatu-earth-50">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
