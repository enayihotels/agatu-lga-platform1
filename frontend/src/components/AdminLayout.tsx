import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/news", label: "News" },
  { to: "/admin/history", label: "Leaders / History" },
  { to: "/admin/media", label: "Media Library" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-agatu-earth-50">
      <header className="border-b border-agatu-earth-200 bg-agatu-earth-900 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="font-bold">AgatuConnect Admin</span>
            <nav className="flex gap-4 text-sm">
              {adminLinks.map((link) => (
                <Link key={link.to} to={link.to} className="hover:underline">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {user && <span>{user.username}</span>}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded bg-agatu-earth-700 px-3 py-1 hover:bg-agatu-earth-600"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
