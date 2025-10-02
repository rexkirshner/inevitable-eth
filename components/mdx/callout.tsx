import React from 'react';
import { AlertCircle, Info, Lightbulb, AlertTriangle } from 'lucide-react';

type CalloutType = 'info' | 'warning' | 'tip' | 'danger';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const calloutStyles: Record<CalloutType, { bg: string; border: string; icon: React.ElementType }> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    icon: Info,
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: AlertTriangle,
  },
  tip: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    icon: Lightbulb,
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    icon: AlertCircle,
  },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const { bg, border, icon: Icon } = calloutStyles[type];

  return (
    <div className={`my-4 rounded border ${border} ${bg} p-4`}>
      <div className="flex gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          {title && (
            <p className="font-semibold mb-1 text-[var(--text)]">
              {title}
            </p>
          )}
          <div className="text-sm text-[var(--text-secondary)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
