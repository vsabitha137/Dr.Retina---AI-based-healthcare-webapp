import React, { useState } from 'react';
import { 
  Building2, 
  Shield, 
  Stethoscope, 
  Microscope, 
  LayoutDashboard, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

export default function LoginScreen({ selectedOrg, onLoginSuccess, onChangeOrg }) {
  const [role, setRole] = useState('doctor'); // 'admin' | 'doctor' | 'lab_tech'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    {
      id: 'doctor',
      label: 'Doctor',
      subtitle: 'Ophthalmologist / Reviewer',
      icon: Stethoscope,
      description: 'Review high-priority AI detections, verify clinical reports, and manage follow-ups.',
      color: 'teal'
    },
    {
      id: 'lab_tech',
      label: 'Lab Technician',
      subtitle: 'Field Screener / Camp Worker',
      icon: Microscope,
      description: 'Rapid patient intake, portable fundus camera upload, and AI triage at rural camps.',
      color: 'cyan'
    },
    {
      id: 'admin',
      label: 'Administrator',
      subtitle: 'System & Camp Manager',
      icon: LayoutDashboard,
      description: 'Manage healthcare workers, screening camps, organization analytics, and audit logs.',
      color: 'slate'
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        role,
        email: email || `${role}@${selectedOrg?.id || 'drretina'}.org`,
        org: selectedOrg
      });
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-teal-50/60 via-slate-50 to-cyan-50/40">
      <div className="w-full max-w-xl">
        
        {/* Navigation & Org Context Bar */}
        <div className="flex items-center justify-between mb-4 text-xs font-semibold">
          <button
            onClick={onChangeOrg}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Organization</span>
          </button>

          {/* Selected Org Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-teal-200 text-teal-800 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span className="truncate max-w-[200px]">{selectedOrg?.name || 'Selected Healthcare Org'}</span>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8">
          
          {/* Card Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Dr.Retina
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your clinical role to access your dedicated screening workspace.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-50/90 border-teal-500 ring-2 ring-teal-400/50 shadow-sm'
                        : 'bg-slate-50/80 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      )}
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

          {/* Role Description Helper */}
          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <span>
              {roles.find(r => r.id === role)?.description}
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Username or Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={
                    role === 'admin' ? 'admin@hospital.org' :
                    role === 'doctor' ? 'dr.sharma@hospital.org' : 'technician.camp1@hospital.org'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-teal-600 hover:text-teal-700 font-semibold">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-600">Remember this workstation</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">256-Bit SSL Encrypted</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-md shadow-teal-600/25 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : `Sign In as ${roles.find(r => r.id === role)?.label}`}</span>
            </button>
          </form>

        </div>

        {/* Medical Data Privacy Notice */}
        <p className="text-center text-[11px] text-slate-400 mt-4 leading-relaxed">
          Accessing authorized ophthalmic healthcare portal. All screening sessions are audited in compliance with medical data privacy regulations.
        </p>

      </div>
    </div>
  );
}
