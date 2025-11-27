'use client';

interface NotionBlockRendererProps {
  blocks: any[];
}

export default function NotionBlockRenderer({ blocks }: NotionBlockRendererProps) {
  const renderRichText = (richTextArray: any[]) => {
    if (!richTextArray) return null;

    return richTextArray.map((text, i) => {
      let content = text.plain_text;

      if (text.href) {
        return (
          <a key={i} href={text.href} className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        );
      }

      let element = <span key={i}>{content}</span>;

      if (text.annotations.bold) {
        element = <strong key={i}>{content}</strong>;
      }
      if (text.annotations.italic) {
        element = <em key={i}>{content}</em>;
      }
      if (text.annotations.code) {
        element = <code key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">{content}</code>;
      }
      if (text.annotations.strikethrough) {
        element = <del key={i}>{content}</del>;
      }
      if (text.annotations.underline) {
        element = <u key={i}>{content}</u>;
      }

      return element;
    });
  };

  const renderBlock = (block: any) => {
    const { type, id } = block;

    switch (type) {
      case 'paragraph':
        return (
          <p key={id} className="mb-4 text-gray-700 leading-relaxed">
            {renderRichText(block.paragraph.rich_text)}
          </p>
        );

      case 'heading_1':
        return (
          <h1 key={id} className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            {renderRichText(block.heading_1.rich_text)}
          </h1>
        );

      case 'heading_2':
        return (
          <h2 key={id} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
            {renderRichText(block.heading_2.rich_text)}
          </h2>
        );

      case 'heading_3':
        return (
          <h3 key={id} className="text-xl font-bold text-gray-900 mt-4 mb-2">
            {renderRichText(block.heading_3.rich_text)}
          </h3>
        );

      case 'bulleted_list_item':
        return (
          <li key={id} className="ml-6 mb-2 text-gray-700 list-disc">
            {renderRichText(block.bulleted_list_item.rich_text)}
          </li>
        );

      case 'numbered_list_item':
        return (
          <li key={id} className="ml-6 mb-2 text-gray-700 list-decimal">
            {renderRichText(block.numbered_list_item.rich_text)}
          </li>
        );

      case 'to_do':
        return (
          <div key={id} className="flex items-start gap-2 mb-2">
            <input
              type="checkbox"
              checked={block.to_do.checked}
              readOnly
              className="mt-1"
            />
            <span className={block.to_do.checked ? 'line-through text-gray-500' : 'text-gray-700'}>
              {renderRichText(block.to_do.rich_text)}
            </span>
          </div>
        );

      case 'toggle':
        return (
          <details key={id} className="mb-4">
            <summary className="cursor-pointer font-medium text-gray-900 mb-2">
              {renderRichText(block.toggle.rich_text)}
            </summary>
          </details>
        );

      case 'code':
        return (
          <pre key={id} className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto mb-4">
            <code className="text-sm font-mono">
              {block.code.rich_text.map((t: any) => t.plain_text).join('')}
            </code>
          </pre>
        );

      case 'quote':
        return (
          <blockquote key={id} className="border-l-4 border-green-500 pl-4 italic text-gray-700 my-4">
            {renderRichText(block.quote.rich_text)}
          </blockquote>
        );

      case 'callout':
        return (
          <div key={id} className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
            <div className="flex items-start gap-3">
              {block.callout.icon && (
                <span className="text-2xl">{block.callout.icon.emoji}</span>
              )}
              <div className="flex-1 text-gray-700">
                {renderRichText(block.callout.rich_text)}
              </div>
            </div>
          </div>
        );

      case 'image':
        const imageUrl = block.image.type === 'external'
          ? block.image.external.url
          : block.image.file.url;
        const caption = block.image.caption ? renderRichText(block.image.caption) : '';

        return (
          <figure key={id} className="my-6">
            <img
              src={imageUrl}
              alt={typeof caption === 'string' ? caption : 'Image'}
              className="w-full rounded-lg border border-gray-200"
            />
            {caption && (
              <figcaption className="text-sm text-gray-500 text-center mt-2">
                {caption}
              </figcaption>
            )}
          </figure>
        );

      case 'video':
        const videoUrl = block.video.type === 'external'
          ? block.video.external.url
          : block.video.file.url;

        return (
          <div key={id} className="my-6">
            <video controls className="w-full rounded-lg border border-gray-200">
              <source src={videoUrl} />
            </video>
          </div>
        );

      case 'file':
        const fileUrl = block.file.type === 'external'
          ? block.file.external.url
          : block.file.file.url;
        const fileName = block.file.name || 'Download file';

        return (
          <div key={id} className="my-4">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              📎 {fileName}
            </a>
          </div>
        );

      case 'divider':
        return <hr key={id} className="my-8 border-gray-200" />;

      case 'equation':
        return (
          <div key={id} className="bg-slate-900 text-slate-50 p-6 rounded-xl font-mono text-lg text-center my-4">
            {block.equation.expression}
          </div>
        );

      case 'table_of_contents':
        return (
          <div key={id} className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="font-medium text-gray-900">Table of Contents</p>
          </div>
        );

      default:
        return (
          <div key={id} className="text-gray-400 text-sm mb-2">
            Unsupported block type: {type}
          </div>
        );
    }
  };

  return (
    <div className="prose prose-slate max-w-none">
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
}
