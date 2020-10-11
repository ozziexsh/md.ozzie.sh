import { ChangeEvent } from 'react';

interface Props {
  value: string;
  onChange(e: ChangeEvent<HTMLTextAreaElement>): void;
  className?: string;
}

export default function Editor({ value, onChange, className }: Props) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className={className}
    ></textarea>
  );
}
