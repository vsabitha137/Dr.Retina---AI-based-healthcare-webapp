import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  ChevronRight,
  Clock,
  Cpu,
  Eye,
  FileText,
  HeartHandshake,
  History,
  ShieldCheck,
  Tent,
  UploadCloud,
  UserCheck,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RetinaViewerLazy } from "@/features/diagnosis/RetinaViewerLazy";

/** Heavy interactive viewer is code-split: never shipped to dashboard routes. */
function RetinaViewer() {
  return <RetinaViewerLazy />;
}

const WORKFLOW = [
  { step: "01", title: "Register Patient", desc: "Quick demographic & diabetes history intake in rural camps or clinics.", Icon: UserCheck },
  { step: "02", title: "Upload Fundus Image", desc: "Capture fundus photography via portable or tabletop retinal camera.", Icon: UploadCloud },
  { step: "03", title: "AI Analysis", desc: "Instant deep-learning segmentation of lesions, exudates, and vessels.", Icon: Cpu },
  { step: "04", title: "Severity Assessment", desc: "Standardized ICDR grading from No DR up to Proliferative DR.", Icon: BarChart3 },
  { step: "05", title: "Prioritize Patient", desc: "High-risk and critical cases flagged immediately for urgent doctor review.", Icon: ShieldCheck },
  { step: "06", title: "Track Screening History", desc: "Longitudinal EHR timeline monitoring progression and treatment outcomes.", Icon: History },
] as const;

const BENEFITS = [
  { Icon: Clock, title: "Faster Camp Screening", desc: "Complete fundus image intake and automated AI quality check in under 60 seconds per patient.", badge: "High Throughput" },
  { Icon: Zap, title: "AI-Assisted Prioritization", desc: "Instantly segregates mild routine cases from sight-threatening proliferative DR requiring immediate laser/anti-VEGF referral.", badge: "Zero Delay" },
  { Icon: Eye, title: "Early Attention Identification", desc: "Detects microaneurysms and subclinical macular changes before irreversible vision impairment develops.", badge: "Preventive Care" },
  { Icon: History, title: "Longitudinal Screening History", desc: "Secure patient record storage allowing year-over-year comparison of retinal vascular progression.", badge: "EHR Integrated" },
  { Icon: Tent, title: "Designed for Rural Screening Camps", desc: "Optimized for low-bandwidth environments, field laptops, and portable non-mydriatic fundus cameras.", badge: "Field Ready" },
  { Icon: HeartHandshake, title: "Clinical Empowerment", desc: "Enables optometrists and health workers to bridge the specialist doctor gap across underserved districts.", badge: "Bridging Gaps" },
] as const;

/** Marketing landing — static Server Component for SEO and fast first paint. */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SiteHeader mode="landing" />
      <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-white to-slate-50 text-slate-900 overflow-hidden">
        <section className="relative pt-8 pb-10 md:pt-12 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-r from-teal-200/30 via-cyan-200/30 to-emerald-200/30 blur-3xl -z-10 rounded-full pointer-events-none" />
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-teal-200/80 shadow-sm text-xs font-semibold text-teal-800">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Next-Generation Ophthalmic AI Platform</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-normal">ICDR Clinical Standard</span>
            </div>
          </div>
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] font-sans">
              AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600">Diabetic Retinopathy</span> Screening
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Helping healthcare workers screen fundus images, identify diabetic retinopathy severity,
              prioritize patients requiring urgent attention, and maintain longitudinal screening history across healthcare camps.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/select-org" className="px-8 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] flex items-center gap-2.5">
                <span>Login to Screening Portal</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a href="#how-it-works" className="px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold text-slate-700 bg-white/90 hover:bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition-all">
                How It Works
              </a>
            </div>
          </div>
          <div className="mt-6 sm:mt-8">
            <RetinaViewer />
          </div>
        </section>

        <section id="how-it-works" className="py-16 md:py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">End-to-End Clinical Flow</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">How It Works</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-3">A streamlined 6-step screening workflow engineered for high-volume rural health camps and clinical ophthalmic practices.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WORKFLOW.map((step) => (
                <div key={step.step} className="relative p-6 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-teal-300 hover:shadow-card transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 text-teal-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                      <step.Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 font-mono group-hover:text-teal-500 transition-colors">{step.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{step.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-center flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-teal-900">
              <span>Register Patient</span><ChevronRight className="w-4 h-4 text-teal-500" aria-hidden="true" />
              <span>Upload Fundus Image</span><ChevronRight className="w-4 h-4 text-teal-500" aria-hidden="true" />
              <span>AI Analysis</span><ChevronRight className="w-4 h-4 text-teal-500" aria-hidden="true" />
              <span>Severity Assessment</span><ChevronRight className="w-4 h-4 text-teal-500" aria-hidden="true" />
              <span>Prioritize Patient</span><ChevronRight className="w-4 h-4 text-teal-500" aria-hidden="true" />
              <span>Track Screening History</span>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">Transforming Camp Operations</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">Platform Benefits</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-3">Engineered specifically to solve the clinical screening bottlenecks faced in remote rural healthcare missions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENEFITS.map((benefit, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-teal-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                        <benefit.Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{benefit.badge}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{benefit.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="disclaimer" className="py-12 bg-slate-100/70 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Medical &amp; Clinical Safety Disclaimer</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  The Dr.Retina AI screening tool is designed to support healthcare workers in rural screening camps with automated
                  triage and prioritization. <strong>This AI system does not replace professional clinical diagnosis.</strong> All diagnostic evaluations
                  and treatment decisions must be reviewed and verified by a licensed ophthalmologist or certified medical professional.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/select-org" className="px-8 py-3 rounded-full text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all inline-flex items-center gap-2">
                <span>Launch Dr.Retina Screening Portal</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <footer className="py-8 bg-white border-t border-slate-200 text-slate-500 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-600" aria-hidden="true" />
              <span className="font-bold text-slate-800">Dr.Retina</span>
              <span>• AI Retinal Screening System v1.0</span>
            </div>
            <p className="text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Adhering to ICDR Standards • Built for Camp &amp; Hospital Operations
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
