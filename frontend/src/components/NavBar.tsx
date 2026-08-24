import { Link, NavLink } from "react-router-dom";

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
  return (
    <header className="border-b border-agatu-earth-200 bg-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-bold text-agatu-river-700">
          AgatuConnect
        </Link>
        <ul className="flex gap-4 text-sm">
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
      </nav>
    </header>
  );
}
