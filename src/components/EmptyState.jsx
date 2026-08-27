import React from 'react';
import { Database, Users, FileCheck2, CalendarClock, ShieldAlert, Plus, RefreshCw, FolderSearch } from 'lucide-react';

export default function EmptyState({ 
  type = 'default', 
  title = 'No data available', 
  description = 'There are currently no records stored in the database for this view.', 
  actionLabel = null, 
  onAction = null,
  compact = false 
}) {
  const getIcon = () => {
    switch (type) {
      case 'patients':
        return <Users className="w-8 h-8 text-teal-600/70" />;
      case 'screenings':
        return <FileCheck2 className="w-8 h-8 text-cyan-600/70" />;
      case 'priority':
        return <ShieldAlert className="w-8 h-8 text-emerald-600/70" />;
      case 'consultations':
        return <CalendarClock className="w-8 h-8 text-blue-600/70" />;
      case 'search':
        return <FolderSearch className="w-8 h-8 text-slate-500/70" />;
      default:
        return <Database className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 transition-all ${
      compact ? 'py-8 px-4' : 'py-14 px-6'
    }`}>
      {/* Icon Capsule */}
      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center mb-3.5">
        {getIcon()}
      </div>

      {/* Main Title */}
      <h4 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h4>
      
      {/* Informative Subtext */}
      <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">{description}</p>

      {/* Optional CTA Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 active:bg-teal-200 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
