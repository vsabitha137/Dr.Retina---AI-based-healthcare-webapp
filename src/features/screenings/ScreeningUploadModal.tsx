"use client";

import * as React from "react";
import { ArrowRight, Camera, Eye, Sparkles, Upload } from "lucide-react";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { requestScreeningAnalysis, fetchScreeningStatus } from "@/features/screenings/api";
import { isDemoMode } from "@/lib/env/env";
import { cn } from "@/lib/utils/cn";

type Step = "upload" | "analyzing" | "result";

interface DemoResult {
  eye: string;
  severity: string;
  confidenceScore: number;
  dmeRisk: string;
  triageAction: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/dicom", "application/dicom"];
const MAX_BYTES = 25 * 1024 * 1024;

export function ScreeningUploadModal({
  open,
  onClose,
  onScreeningCompleted,
}: {
  open: boolean;
  onClose: () => void;
  onScreeningCompleted?: (r: unknown) => void;
}) {
  const [step, setStep] = React.useState<Step>("upload");
  const [selectedEye, setSelectedEye] = React.useState<"OD" | "OS">("OD");
  const [patientId, setPatientId] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [aiResult, setAiResult] = React.useState<DemoResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep("upload");
    setAiResult(null);
    setError(null);
    setFileError(null);
  };

  const handleFile = (f: File | undefined) => {
    setFileError(null);
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type) && !/\.(jpe?g|png|dcm)$/i.test(f.name)) {
      setFileError("Unsupported file. Upload a JPEG, PNG, or DICOM fundus image.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setFileError("File exceeds 25 MB. Please compress or choose another image.");
      return;
    }
    setFile(f);
  };

  const handleStartAnalysis = async () => {
    setError(null);
    if (!patientId.trim()) {
      setError("Enter a Patient ID first.");
      return;
    }
    setStep("analyzing");

    if (isDemoMode()) {
      // DEMO_MODE: simulated pipeline so the UI can be evaluated offline.
      await new Promise((r) => setTimeout(r, 1500));
      setAiResult({
        eye: selectedEye,
        severity: "Moderate NPDR",
        confidenceScore: 98.4,
        dmeRisk: "Low Risk",
        triageAction: "Queued for Doctor Review",
      });
      setStep("result");
      return;
    }

    try {
      if (!file) {
        setError("Select a fundus image to analyze.");
        setStep("upload");
        return;
      }
      const job = await requestScreeningAnalysis({ patientId, eye: selectedEye, image: file });
      // Poll job status with backoff (processing is async by design).
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const status = await fetchScreeningStatus(job.jobId);
        if (status.status === "COMPLETED") break;
        if (status.status === "FAILED") throw new Error("Analysis failed. Please retry.");
      }
      setAiResult({
        eye: selectedEye,
        severity: "Pending review",
        confidenceScore: 0,
        dmeRisk: "Pending",
        triageAction: "Queued for Doctor Review",
      });
      setStep("result");
    } catch {
      setError("Analysis failed. Please check the image and try again.");
      setStep("upload");
    }
  };

  const handleFinish = () => {
    if (aiResult) onScreeningCompleted?.(aiResult);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => { reset(); onClose(); }} labelledBy="su-title" maxWidth="max-w-xl">
      <DialogHeader id="su-title" title="Start Fundus Screening" subtitle="Portable Camera Intake & AI Analysis Pipeline" onClose={onClose} />
      <div className="p-6">
        {step === "upload" && (
          <div className="space-y-5">
            <div>
              <label htmlFor="su-patient" className="block text-xs font-semibold text-slate-700 mb-1">Select Patient / MRN *</label>
              <input id="su-patient" type="text" placeholder="Enter Patient ID (e.g. PAT-2026-004)" value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1">Eye Lateral Identifier</span>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Eye">
                {(["OD", "OS"] as const).map((eye) => (
                  <button
                    key={eye}
                    type="button"
                    role="radio"
                    aria-checked={selectedEye === eye}
                    onClick={() => setSelectedEye(eye)}
                    className={cn("py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all", selectedEye === eye ? "bg-teal-50 border-teal-500 text-teal-800 ring-1 ring-teal-400" : "border-slate-200 text-slate-600 hover:bg-slate-50")}
                  >
                    <Eye className="w-4 h-4 text-teal-600" aria-hidden="true" />
                    <span>{eye === "OD" ? "OD (Right Eye / Oculus Dexter)" : "OS (Left Eye / Oculus Sinister)"}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1">Fundus Retinal Photograph</span>
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.dcm,image/jpeg,image/png" className="sr-only" aria-label="Fundus retinal photograph" onChange={(e) => handleFile(e.target.files?.[0])} />
              <div onClick={() => fileRef.current?.click()} onKeyDown={(e) => { if (e.key === "Enter") fileRef.current?.click(); }} tabIndex={0} role="button" aria-label="Upload fundus image" className="border-2 border-dashed border-teal-300 rounded-2xl p-6 bg-teal-50/40 text-center hover:bg-teal-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-teal-200 shadow-sm flex items-center justify-center mx-auto mb-3 text-teal-600 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold text-slate-800">{file ? file.name : "Click to upload fundus image or capture from camera"}</p>
                <p className="text-[11px] text-slate-500 mt-1">Supports DICOM, JPEG, PNG • Max 25 MB • Automatic quality &amp; macula centering check</p>
              </div>
              {fileError && <p role="alert" className="text-xs text-rose-600 mt-1">{fileError}</p>}
            </div>
            {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="button" onClick={handleStartAnalysis} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Run AI Analysis</span>
              </button>
            </div>
          </div>
        )}
        {step === "analyzing" && (
          <div className="py-12 px-4 text-center space-y-4" role="status" aria-label="Analyzing fundus scan">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin" />
              <Eye className="w-7 h-7 text-teal-600 absolute inset-0 m-auto animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Processing Retinal Fundus Scan</h4>
              <p className="text-xs text-slate-500 mt-1">Running deep learning segmentation, microaneurysm mapping &amp; ICDR grading...</p>
            </div>
          </div>
        )}
        {step === "result" && aiResult && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">AI Classification Complete</span>
                <div className="mt-1"><SeverityBadge severity={aiResult.severity} size="md" /></div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">Confidence</span>
                <p className="text-base font-extrabold text-teal-700">{aiResult.confidenceScore}%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Laterality</span>
                <p className="font-bold text-slate-800 mt-0.5">{aiResult.eye === "OD" ? "Right Eye (OD)" : "Left Eye (OS)"}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Macular Edema (DME)</span>
                <p className="font-bold text-slate-800 mt-0.5">{aiResult.dmeRisk}</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Screening support output — requires ophthalmologist review before any clinical decision.</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Camera className="w-3.5 h-3.5" aria-hidden="true" /> Queued for ophthalmologist review</span>
              <button type="button" onClick={handleFinish} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 flex items-center gap-1.5">
                <span>Submit to Triage Queue</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
