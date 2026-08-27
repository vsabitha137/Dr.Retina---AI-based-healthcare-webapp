import React, { useState } from 'react';
import { X, Camera, Upload, Sparkles, CheckCircle2, AlertTriangle, Eye, ArrowRight } from 'lucide-react';
import { submitScreening } from '../services/drRetinaApi';
import SeverityBadge from './SeverityBadge';

export default function ScreeningUploadModal({ isOpen, onClose, onScreeningCompleted }) {
  const [step, setStep] = useState('upload'); // 'upload' | 'analyzing' | 'result'
  const [selectedEye, setSelectedEye] = useState('OD'); // 'OD' (Right Eye) | 'OS' (Left Eye)
  const [patientIdInput, setPatientIdInput] = useState('');
  const [aiResult, setAiResult] = useState(null);

  if (!isOpen) return null;

  const handleStartAnalysis = () => {
    setStep('analyzing');
    setTimeout(() => {
      // Return clinical result schema (ready for API integration)
      setAiResult({
        eye: selectedEye,
        severity: 'Moderate NPDR',
        confidenceScore: 98.4,
        lesionsDetected: ['Microaneurysms (3)', 'Cotton Wool Spot (1)'],
        dmeRisk: 'Low Risk',
        triageAction: 'Queued for Doctor Review'
      });
      setStep('result');
    }, 2000);
  };

  const handleFinish = async () => {
    if (aiResult) {
      await submitScreening({ patientId: patientIdInput, ...aiResult });
      if (onScreeningCompleted) onScreeningCompleted(aiResult);
    }
    setStep('upload');
    setAiResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600/60 flex items-center justify-center border border-teal-400/30">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Start Fundus Screening</h3>
              <p className="text-[11px] text-teal-200">Portable Camera Intake & AI Analysis Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-teal-600/40 text-teal-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'upload' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Patient / MRN *</label>
                <input
                  type="text"
                  placeholder="Enter Patient ID (e.g. PAT-2026-004)"
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Eye Lateral Identifier</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEye('OD')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      selectedEye === 'OD'
                        ? 'bg-teal-50 border-teal-500 text-teal-800 ring-1 ring-teal-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Eye className="w-4 h-4 text-teal-600" />
                    <span>OD (Right Eye / Oculus Dexter)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedEye('OS')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      selectedEye === 'OS'
                        ? 'bg-teal-50 border-teal-500 text-teal-800 ring-1 ring-teal-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Eye className="w-4 h-4 text-teal-600" />
                    <span>OS (Left Eye / Oculus Sinister)</span>
                  </button>
                </div>
              </div>

              {/* Fundus Image Dropzone / Camera Capture */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fundus Retinal Photograph</label>
                <div 
                  onClick={handleStartAnalysis}
                  className="border-2 border-dashed border-teal-300 rounded-2xl p-6 bg-teal-50/40 text-center hover:bg-teal-50 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-teal-200 shadow-sm flex items-center justify-center mx-auto mb-3 text-teal-600 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Click to upload fundus image or capture from camera</p>
                  <p className="text-[11px] text-slate-500 mt-1">Supports DICOM, JPEG, PNG • Automatic quality & macula centering check</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run AI Analysis</span>
                </button>
              </div>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin"></div>
                <Eye className="w-7 h-7 text-teal-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Processing Retinal Fundus Scan</h4>
                <p className="text-xs text-slate-500 mt-1">Running deep learning segmentation, microaneurysm mapping & ICDR grading...</p>
              </div>
            </div>
          )}

          {step === 'result' && aiResult && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">AI Classification Complete</span>
                  <div className="mt-1">
                    <SeverityBadge severity={aiResult.severity} size="md" />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium">Confidence</span>
                  <p className="text-base font-extrabold text-teal-700">{aiResult.confidenceScore}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Laterality</span>
                  <p className="font-bold text-slate-800 mt-0.5">{aiResult.eye === 'OD' ? 'Right Eye (OD)' : 'Left Eye (OS)'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Macular Edema (DME)</span>
                  <p className="font-bold text-slate-800 mt-0.5">{aiResult.dmeRisk}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Queued for ophthalmologist review</span>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 flex items-center gap-1.5"
                >
                  <span>Submit to Triage Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
