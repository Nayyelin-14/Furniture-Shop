import DOMPurify from "dompurify";
const TextPurify = ({ content }: { content: string }) => {
  const purifyText = DOMPurify.sanitize(content);
  return (
    <div dangerouslySetInnerHTML={{ __html: purifyText }} className="my-4" />
  );
};

export default TextPurify;
