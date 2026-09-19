"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  Lock,
  Mail,
  Microscope,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/features/auth/actions";
import { LoginSchema, type LoginInput } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils/cn";

const ROLES = [
  { id: "DOCTOR", label: "Doctor", subtitle: "Ophthalmologist / Reviewer", Icon: Stethoscope, description: "Review high-priority AI detections, verify clinical reports, and manage follow-ups." },
  { id: "LAB_TECH", label: "Lab Technician", subtitle: "Field Screener / Camp Worker", Icon: Microscope, description: "Rapid patient intake, portable fundus camera upload, and AI triage at rural camps." },
  { id: "ADMIN", label: "Administrator", subtitle: "System & Camp Manager", Icon: LayoutDashboard, description: "Manage healthcare workers, screening camps, organization analytics, and audit logs." },
] as const;

export function LoginForm() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get("orgId") ?? "";
  const orgName = searchParams.get("orgName") ?? "Selected Healthcare Org";
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", role: "DOCTOR", orgId },
  });

  const role = watch("role");

  React.useEffect(() => {
    setValue("orgId", orgId);
  }, [orgId, setValue]);

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const fd = new FormData();
    fd.set("email", data.email);
    fd.set("password", data.password);
    fd.set("role", data.role);
    fd.set("orgId", data.orgId || orgId);
    fd.set("orgName", orgName);
    const result = await loginAction(fd);
    if (result && !result.ok) setServerError(result.error);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-teal-50/60 via-slate-50 to-cyan-50/40">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-4 text-xs font-semibold">
          <Link href="/select-org" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-teal-700 transition-colors">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Change Organization</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-teal-200 text-teal-800 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
            <span className="truncate max-w-[200px]">{orgName}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to Dr.Retina</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Select your clinical role to access your dedicated screening workspace.</p>
          </div>

          <div className="mb-6">
            <span id="role-label" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Select Your Role</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" role="radiogroup" aria-labelledby="role-label">
              {ROLES.map((r) => {
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setValue("role", r.id)}
                    className={cn("p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between", isSelected ? "bg-teal-50/90 border-teal-500 ring-2 ring-teal-400/50 shadow-sm" : "bg-slate-50/80 border-slate-200 hover:bg-slate-50 hover:border-slate-300")}
                  >
                    <div className="flex items-center justify-between">
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", isSelected ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600")}>
                        <r.Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" aria-hidden="true" />}
                    </div>
                    <div className="mt-2.5">
                      <h4 className="text-xs font-bold text-slate-900">{r.label}</h4>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{r.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{ROLES.find((r) => r.id === role)?.description}</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Username or Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="email"
                  type="text"
                  autoComplete="username"
                  placeholder={role === "ADMIN" ? "admin@hospital.org" : role === "DOCTOR" ? "dr.sharma@hospital.org" : "technician.camp1@hospital.org"}
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                />
              </div>
              {errors.email && <p role="alert" className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
            </div>

            <PasswordField register={register} error={errors.password?.message} />

            <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-full text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-md shadow-teal-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              <KeyRound className="w-4 h-4" aria-hidden="true" />
              <span>{isSubmitting ? "Authenticating..." : `Sign In as ${ROLES.find((r) => r.id === role)?.label}`}</span>
            </button>
            {serverError && <p role="alert" className="text-xs text-rose-600 text-center">{serverError}</p>}
            {errors.orgId && <p role="alert" className="text-xs text-rose-600 text-center">Please select an organization first.</p>}
          </form>
        </div>
        <p className="text-center text-[11px] text-slate-400 mt-4 leading-relaxed">Accessing authorized ophthalmic healthcare portal. All screening sessions are audited in compliance with medical data privacy regulations.</p>
      </div>
    </div>
  );
}

function PasswordField({ register, error }: { register: ReturnType<typeof useForm<LoginInput>>["register"]; error?: string }) {
  const [show, setShow] = React.useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Password</label>
        <span className="text-xs text-teal-600 font-semibold">Forgot password?</span>
      </div>
      <div className="relative">
        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
        <input
          id="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter security password"
          {...register("password")}
          aria-invalid={!!error}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
        />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2">
          {show ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
        </button>
      </div>
      {error && <p role="alert" className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}
