import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { getMe, login, register } from "@/api/auth";
import { listWards } from "@/api/wards";
import { useAuthStore } from "@/store/authStore";

const signupSchema = z.object({
  username: z.string().min(3, "At least 3 characters"),
  email: z.string().email("Enter a valid email"),
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  phone_number: z.string().min(10, "Enter a valid phone number"),
  ward: z.string().optional().default(""),
  password: z.string().min(8, "At least 8 characters"),
});
type SignupFormValues = z.input<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: wards } = useQuery({ queryKey: ["wards"], queryFn: listWards });

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);
    try {
      await register({
        username: values.username,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        ward: values.ward ? Number(values.ward) : null,
        password: values.password,
      });

      // Auto-login right after signup so there's no extra friction.
      const tokens = await login(values.username, values.password);
      setTokens(tokens.access, tokens.refresh);
      const profile = await getMe();
      setUser(profile);

      navigate("/account");
    } catch {
      setServerError(
        "Couldn't create your account. The username or email may already be taken.",
      );
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-1 text-2xl font-bold text-agatu-earth-900">
        Create your AgatuConnect account
      </h1>
      <p className="mb-6 text-sm text-agatu-earth-600">
        Get flood alerts, track your reports, and stay connected to Agatu LGA.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              placeholder="First name"
              className="w-full rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...registerField("first_name")}
            />
            {errors.first_name && (
              <p className="mt-1 text-xs text-agatu-alert-critical">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <input
              placeholder="Last name"
              className="w-full rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...registerField("last_name")}
            />
            {errors.last_name && (
              <p className="mt-1 text-xs text-agatu-alert-critical">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <input
          placeholder="Username"
          className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
          {...registerField("username")}
        />
        {errors.username && (
          <p className="text-xs text-agatu-alert-critical">{errors.username.message}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
          {...registerField("email")}
        />
        {errors.email && (
          <p className="text-xs text-agatu-alert-critical">{errors.email.message}</p>
        )}

        <input
          type="tel"
          placeholder="Phone number (e.g. +234...)"
          className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
          {...registerField("phone_number")}
        />
        {errors.phone_number && (
          <p className="text-xs text-agatu-alert-critical">
            {errors.phone_number.message}
          </p>
        )}

        <select
          className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
          {...registerField("ward")}
        >
          <option value="">Select your ward (optional)</option>
          {wards?.map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.name}
            </option>
          ))}
        </select>

        <input
          type="password"
          placeholder="Password"
          className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
          {...registerField("password")}
        />
        {errors.password && (
          <p className="text-xs text-agatu-alert-critical">{errors.password.message}</p>
        )}

        {serverError && (
          <p className="text-sm text-agatu-alert-critical">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded bg-agatu-farm-600 px-4 py-2 font-medium text-white hover:bg-agatu-farm-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-agatu-earth-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-agatu-river-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
