'use client';

interface NotionBlockRendererProps {
  blocks: any[];
}

// Helper function to group consecutive list items
const groupListItems = (blocks: any[]) => {
  const grouped: any[] = [];
  let currentList: any = null;

  blocks.forEach((block) => {
    if (block.type === 'bulleted_list_item') {
      if (!currentList || currentList.type !== 'bulleted') {
        currentList = { type: 'bulleted', items: [block] };
        grouped.push(currentList);
      } else {
        currentList.items.push(block);
      }
    } else if (block.type === 'numbered_list_item') {
      if (!currentList || currentList.type !== 'numbered') {
        currentList = { type: 'numbered', items: [block] };
        grouped.push(currentList);
      } else {
        currentList.items.push(block);
      }
    } else {
      currentList = null;
      grouped.push(block);
    }
  });

  return grouped;
};

export default function NotionBlockRenderer({ blocks }: NotionBlockRendererProps) {
  const renderRichText = (richTextArray: any[]) => {
    if (!richTextArray) return null;

    return richTextArray.map((text, i) => {
      let content = text.plain_text;
      const annotations = text.annotations;

      // Color class mappings
      const colorClasses: Record<string, string> = {
        gray: 'text-gray-600',
        brown: 'text-amber-700',
        orange: 'text-orange-600',
        yellow: 'text-yellow-600',
        green: 'text-green-600',
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        pink: 'text-pink-600',
        red: 'text-red-600',
      };

      const bgColorClasses: Record<string, string> = {
        gray_background: 'bg-gray-100 px-1 rounded',
        brown_background: 'bg-amber-100 px-1 rounded',
        orange_background: 'bg-orange-100 px-1 rounded',
        yellow_background: 'bg-yellow-100 px-1 rounded',
        green_background: 'bg-green-100 px-1 rounded',
        blue_background: 'bg-blue-100 px-1 rounded',
        purple_background: 'bg-purple-100 px-1 rounded',
        pink_background: 'bg-pink-100 px-1 rounded',
        red_background: 'bg-red-100 px-1 rounded',
      };

      let className = '';
      if (annotations.color && annotations.color !== 'default') {
        if (annotations.color.endsWith('_background')) {
          className = bgColorClasses[annotations.color] || '';
        } else {
          className = colorClasses[annotations.color] || '';
        }
      }

      if (text.href) {
        return (
          <a key={i} href={text.href} className={`text-green-600 hover:underline ${className}`} target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        );
      }

      if (annotations.code) {
        return <code key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">{content}</code>;
      }

      let element: React.ReactNode = <span key={i} className={className}>{content}</span>;

      if (annotations.bold) element = <strong>{element}</strong>;
      if (annotations.italic) element = <em>{element}</em>;
      if (annotations.strikethrough) element = <del>{element}</del>;
      if (annotations.underline) element = <u>{element}</u>;

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
          <li key={id} className="mb-2 text-gray-700">
            {renderRichText(block.bulleted_list_item.rich_text)}
          </li>
        );

      case 'numbered_list_item':
        return (
          <li key={id} className="mb-2 text-gray-700">
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
          <details key={id} className="mb-4 border border-gray-200 rounded-lg">
            <summary className="cursor-pointer font-medium text-gray-900 p-4 hover:bg-gray-50">
              {renderRichText(block.toggle.rich_text)}
            </summary>
            {block.children && block.children.length > 0 && (
              <div className="p-4 pt-0 border-t border-gray-100">
                <NotionBlockRenderer blocks={block.children} />
              </div>
            )}
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
        const calloutColors: Record<string, string> = {
          gray: 'bg-gray-50 border-gray-500',
          brown: 'bg-amber-50 border-amber-500',
          orange: 'bg-orange-50 border-orange-500',
          yellow: 'bg-yellow-50 border-yellow-500',
          green: 'bg-green-50 border-green-500',
          blue: 'bg-blue-50 border-blue-500',
          purple: 'bg-purple-50 border-purple-500',
          pink: 'bg-pink-50 border-pink-500',
          red: 'bg-red-50 border-red-500',
        };

        const color = block.callout.color?.replace('_background', '') || 'blue';
        const colorClass = calloutColors[color] || calloutColors.blue;

        return (
          <div
            key={id}
            className={`${colorClass} border-l-4 p-4 mb-4 rounded`}
          >
            <div className="flex items-start gap-3">
              {block.callout.icon && (
                <span className="text-2xl flex-shrink-0">{block.callout.icon.emoji}</span>
              )}
              <div className="flex-1 text-gray-700">
                {renderRichText(block.callout.rich_text)}
              </div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={id} className="overflow-x-auto my-6">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <tbody className="divide-y divide-gray-200">
                {block.children?.map((row: any, rowIdx: number) => (
                  <tr key={row.id} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.table_row?.cells?.map((cell: any[], cellIdx: number) => {
                      const isHeader = block.table.has_row_header && rowIdx === 0;
                      const Tag = isHeader ? 'th' : 'td';
                      return (
                        <Tag
                          key={cellIdx}
                          className={`px-4 py-3 text-sm ${
                            isHeader
                              ? 'font-bold bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                          }`}
                        >
                          {renderRichText(cell)}
                        </Tag>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'table_row':
        return null; // Handled by parent table

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

  const groupedBlocks = groupListItems(blocks);

  return (
    <div className="prose prose-slate max-w-none">
      {groupedBlocks.map((item, idx) => {
        if (item.type === 'bulleted') {
          return (
            <ul key={`list-${idx}`} className="space-y-1 mb-4 ml-6 list-disc">
              {item.items.map((block: any) => renderBlock(block))}
            </ul>
          );
        }
        if (item.type === 'numbered') {
          return (
            <ol key={`list-${idx}`} className="space-y-1 mb-4 ml-6 list-decimal">
              {item.items.map((block: any) => renderBlock(block))}
            </ol>
          );
        }
        return renderBlock(item);
      })}
    </div>
  );
}
