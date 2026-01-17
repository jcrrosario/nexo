type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      {children}
    </div>
  );
}
