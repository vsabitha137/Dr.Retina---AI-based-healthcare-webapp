import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  subtitle = null, 
  icon: Icon, 
  color = 'teal', 
  trend = null,
  trendPositive = true,
  isLoading = false 
}) {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50',
      iconBg: 'bg-teal-500/10 text-teal-700 border-teal-200/60',
      border: 'border-slate-200/80 hover:border-teal-300'
    },
    cyan: {
      bg: 'bg-cyan-50',
      iconBg: 'bg-cyan-500/10 text-cyan-700 border-cyan-200/60',
      border: 'border-slate-200/80 hover:border-cyan-300'
    },
    rose: {
      bg: 'bg-rose-50',
      iconBg: 'bg-rose-500/10 text-rose-700 border-rose-200/60',
      border: 'border-slate-200/80 hover:border-rose-300'
    },
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-500/10 text-amber-700 border-amber-200/60',
      border: 'border-slate-200/80 hover:border-amber-300'
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/60',
      border: 'border-slate-200/80 hover:border-emerald-300'
    },
    slate: {
      bg: 'bg-slate-50',
      iconBg: 'bg-slate-500/10 text-slate-700 border-slate-200/60',
      border: 'border-slate-200/80 hover:border-slate-300'
    }
  };

  const scheme = colorMap[color] || colorMap.teal;

  return (
    <div className={`p-5 rounded-2xl bg-white border ${scheme.border} shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          {isLoading ? (
            <div className="h-7 w-20 bg-slate-200 rounded animate-pulse my-1"></div>
          ) : (
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {value}
            </h3>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span className={`inline-flex items-center gap-0.5 font-semibold ${
              trendPositive ? 'text-teal-700' : 'text-rose-600'
            }`}>
              {trendPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
