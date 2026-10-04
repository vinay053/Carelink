import React from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ConflictCard({ conflict, onResolve, loading = false }) {
  const isHigh = conflict.severity === 'high';

  return (
    <div className={`p-4 rounded-xl border bg-bgCard text-xs space-y-3 transition-all ${
      isHigh ? 'border-t-4 border-t-danger border-borderColor shadow-lg shadow-danger/5' : 'border-t-4 border-t-warning border-borderColor'
    }`}>
      {/* Conflict Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {isHigh ? (
            <ShieldAlert className="w-4 h-4 text-danger animate-pulse" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-warning" />
          )}
          <span className="font-bold uppercase tracking-wider text-textPrimary">
            Drug Discrepancy Detected
          </span>
        </div>
        <Badge variant={isHigh ? 'danger' : 'warning'} size="sm">
          {conflict.severity?.toUpperCase()} SEVERITY
        </Badge>
      </div>

      {/* Drug Pair Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2.5 py-1 rounded bg-bgElevated border border-borderColor font-bold text-textPrimary">
          {conflict.drug1}
        </span>
        <span className="text-textSecondary font-bold">+</span>
        <span className="px-2.5 py-1 rounded bg-bgElevated border border-borderColor font-bold text-textPrimary">
          {conflict.drug2}
        </span>
      </div>

      {/* Clinical Explanation */}
      <p className="text-textSecondary leading-relaxed bg-bgElevated/50 p-2.5 rounded-lg border border-borderColor/60">
        {conflict.explanation}
      </p>

      {/* Source Citation & Actions */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-textSecondary italic">
          Source: {conflict.source || 'Clinical Interaction Rules'}
        </span>

        {conflict.status !== 'resolved' ? (
          <Button
            variant="outline"
            size="sm"
            loading={loading}
            onClick={() => onResolve(conflict._id)}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Clinician Resolved
          </Button>
        ) : (
          <Badge variant="success" size="sm">
            RESOLVED
          </Badge>
        )}
      </div>
    </div>
  );
}
