import marked from 'marked';

interface Props {
  value?: string;
}

export default function Preview({ value }: Props) {
  return (
    <div
      className="prose p-4"
      dangerouslySetInnerHTML={{ __html: marked(value || '') }}
    ></div>
  );
}
