import React from 'react';

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="w-8 h-8 bg-slate-100 rounded-xl"></div>
      </div>
      <div className="h-8 bg-slate-200 rounded w-1/2"></div>
      <div className="h-3 bg-slate-100 rounded w-3/4"></div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="py-4 px-4">
          <div className="h-4 bg-slate-200 rounded w-4/5"></div>
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-100 rounded w-20"></div>
      </div>
      <div className="h-48 bg-slate-100 rounded-xl flex items-end justify-between p-4 gap-2">
        <div className="w-8 bg-slate-200 rounded-t h-1/3"></div>
        <div className="w-8 bg-slate-200 rounded-t h-1/2"></div>
        <div className="w-8 bg-slate-200 rounded-t h-3/4"></div>
        <div className="w-8 bg-slate-200 rounded-t h-2/3"></div>
        <div className="w-8 bg-slate-200 rounded-t h-5/6"></div>
        <div className="w-8 bg-slate-200 rounded-t h-1/2"></div>
      </div>
    </div>
  );
}
