type Props = {
  title: string;
  description: string;
  level?: 'neutral' | 'warning' | 'danger';
  actions?: React.ReactNode;
};

export default function InsightCard({
  title,
  description,
  level = 'neutral',
  actions,
}: Props) {
  const styles = {
    neutral: 'bg-slate-50 border-slate-200',
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
  };

  return (
    <div
      className={`
        border rounded-2xl p-6 space-y-4
        ${styles[level]}
      `}
    >
      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      {actions && (
        <div className="flex gap-4 pt-2">
          {actions}
        </div>
      )}
    </div>
  );
}
