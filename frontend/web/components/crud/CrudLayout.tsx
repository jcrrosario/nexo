import React from 'react';

type Props = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export default function CrudLayout({
  title,
  action,
  children,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-xl font-semibold text-blue-900">
          {title}
        </h1>

        {action && (
          <div className="flex items-center">
            {action}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
