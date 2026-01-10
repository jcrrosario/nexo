export default function CrudLayout({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-xl font-semibold text-blue-900">
          {title}
        </h1>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
