type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-80 px-4 py-2 rounded-lg border
                 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
  );
}
