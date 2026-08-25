import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  content_editor: "Content Editor",
  ward_officer: "Ward Officer",
  verified_resident: "Verified Resident",
  diaspora_member: "Diaspora Member",
  service_account: "Service Account",
};

export default function AccountPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-agatu-earth-900">My Account</h1>

      <div className="mt-6 flex flex-col gap-3 rounded-lg border border-agatu-earth-200 bg-white p-4">
        <div>
          <p className="text-xs uppercase text-agatu-earth-500">Name</p>
          <p className="font-medium">
            {user.first_name} {user.last_name}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-agatu-earth-500">Username</p>
          <p className="font-medium">{user.username}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-agatu-earth-500">Role</p>
          <p className="font-medium">{roleLabels[user.role] ?? user.role}</p>
        </div>
        {user.ward_name && (
          <div>
            <p className="text-xs uppercase text-agatu-earth-500">Ward</p>
            <p className="font-medium">{user.ward_name}</p>
          </div>
        )}
        <div>
          <p className="text-xs uppercase text-agatu-earth-500">
            Phone verification
          </p>
          <p className="font-medium">
            {user.is_phone_verified ? (
              <span className="text-agatu-farm-700">Verified</span>
            ) : (
              <span className="text-agatu-alert-warning">Not verified yet</span>
            )}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 w-full rounded border border-agatu-earth-200 px-4 py-2 text-sm font-medium text-agatu-earth-700 hover:bg-agatu-earth-100"
      >
        Log out
      </button>
    </div>
  );
}
