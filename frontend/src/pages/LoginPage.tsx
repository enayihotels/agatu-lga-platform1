import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { getMe, login } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const tokens = await login(values.username, values.password);
      setTokens(tokens.access, tokens.refresh);

      const profile = await getMe();
      setUser(profile);

      const staffRoles = new Set(["super_admin", "content_editor", "ward_officer"]);
      navigate(staffRoles.has(profile.role) ? "/admin" : "/account");
    } catch {
      setServerError("Invalid username or password.");
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-xl font-bold text-agatu-earth-900">
        Log in to AgatuConnect
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full rounded border border-agatu-earth-200 px-3 py-2"
            {...register("username")}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-agatu-alert-critical">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded border border-agatu-earth-200 px-3 py-2"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-agatu-alert-critical">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-agatu-alert-critical">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-agatu-river-600 px-4 py-2 font-medium text-white hover:bg-agatu-river-700 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-agatu-earth-600">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-medium text-agatu-farm-700">
          Sign up
        </Link>
      </p>
    </div>
  );
}
