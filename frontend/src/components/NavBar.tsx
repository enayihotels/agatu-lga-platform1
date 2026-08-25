import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import InstallAppButton from "@/components/InstallAppButton";
import { useAuthStore } from "@/store/authStore";

const links = [
  { to: "/", label: "Home" },
  { to: "/news", label: "News" },
  { to: "/history", label: "History" },
  { to: "/culture", label: "Culture" },
  { to: "/wards", label: "Wards" },
  { to: "/events", label: "Events" },
  { to: "/alerts", label: "Alerts" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  return (
    <header className="sticky top-0 z-20 border-b border-agatu-earth-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-agatu-river-700">
          AgatuConnect
        </Link>

        {/* Desktop links */}
        <ul className="hidden gap-4 text-sm md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-agatu-river-700"
                    : "text-agatu-earth-700 hover:text-agatu-river-600"
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <InstallAppButton />
          {isAuthenticated ? (
            <Link
              to="/account"
              className="rounded bg-agatu-river-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-agatu-river-700"
            >
              My Account
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-agatu-earth-700 hover:text-agatu-river-600"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded bg-agatu-farm-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-agatu-farm-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded md:hidden"
          aria-label="Toggle menu"
        >
          <span className="flex flex-col gap-1">
            <span className="h-0.5 w-5 bg-agatu-earth-800" />
            <span className="h-0.5 w-5 bg-agatu-earth-800" />
            <span className="h-0.5 w-5 bg-agatu-earth-800" />
          </span>
        </button>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="border-t border-agatu-earth-200 bg-white px-4 py-3 md:hidden">
          <div className="mb-3">
            <InstallAppButton />
          </div>
          <ul className="flex flex-col gap-2 text-sm">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "block py-1 font-semibold text-agatu-river-700"
                      : "block py-1 text-agatu-earth-700"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2 border-t border-agatu-earth-100 pt-3">
            {isAuthenticated ? (
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded bg-agatu-river-600 px-3 py-2 text-center text-sm font-medium text-white"
              >
                My Account
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded border border-agatu-earth-200 px-3 py-2 text-center text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded bg-agatu-farm-600 px-3 py-2 text-center text-sm font-medium text-white"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
