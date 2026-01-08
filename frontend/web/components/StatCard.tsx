type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'success' | 'danger' | 'warning';
};

export default function StatCard({
  title,
  value,
  subtitle,
  variant = 'success',
}: StatCardProps) {
  const variants = {
    success: {
      bg: 'bg-green-100',
      text: 'text-green-700',
    },
    danger: {
      bg: 'bg-red-100',
      text: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
    },
  };

  const styles = variants[variant];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>

      <div className="flex items-center gap-3 mt-2">
        <p className="text-3xl font-semibold text-blue-900">
          {value}
        </p>

        {subtitle && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${styles.bg} ${styles.text}`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
