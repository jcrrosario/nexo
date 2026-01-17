type Props = {
  text: string;
};

export default function MetaInfo({ text }: Props) {
  return (
    <span className="text-sm text-gray-500">
      {text}
    </span>
  );
}
