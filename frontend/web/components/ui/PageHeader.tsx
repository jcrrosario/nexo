type Props = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  actions,
}: Props) {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-blue-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex gap-2">{actions}</div>
      )}
    </div>
  );
}
