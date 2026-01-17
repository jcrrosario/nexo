'use client';

import { ReactNode } from 'react';

type Variant = 'default' | 'success' | 'warning' | 'danger';

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  default: 'text-blue-900',
  success: 'text-green-600',
  warning: 'text-orange-500',
  danger: 'text-red-500',
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
}: Props) {
  return (
    <div
      className="
        bg-white
        border border-gray-100
        rounded-xl
        px-5 py-4
        shadow-sm
        flex items-center gap-4
      "
    >
      {/* Ícone */}
      {icon && (
        <div className="w-12 h-12 flex items-center justify-center">
          <div className={`text-2xl ${variants[variant]}`}>
            {icon}
          </div>
        </div>
      )}

      {/* Texto */}
      <div className="space-y-0.5">
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <div className="flex items-baseline gap-2">
          <span
            className={`text-2xl font-semibold ${variants[variant]}`}
          >
            {value}
          </span>

          {subtitle && (
            <span className="text-sm text-gray-400">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
