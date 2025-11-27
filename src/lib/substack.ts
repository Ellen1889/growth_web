import { Reflection } from '@/types';

interface SubstackItem {
  title: string;
  link: string;
  pubDate: string;
  'content:encoded': string;
  description: string;
  guid: string;
  categories?: string[];
}

export async function getSubstackPosts(): Promise<Reflection[]> {
  try {
    const response = await fetch('https://ellen1889.substack.com/feed', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Failed to fetch Substack RSS');
      return [];
    }

    const xmlText = await response.text();

    // Parse XML manually (simple parser for RSS)
    const items = parseRSSItems(xmlText);

    return items.map((item, index) => ({
      id: item.guid || `substack-${index}`,
      title: item.title || 'Untitled',
      excerpt: stripHtml(item.description || '').substring(0, 250) + '...',
      date: formatDate(item.pubDate),
      readTime: calculateReadTime(item['content:encoded'] || item.description || ''),
      imageUrl: extractFirstImage(item['content:encoded'] || item.description || ''),
      categories: item.categories || [],
      url: item.link || '',
    }));
  } catch (error) {
    console.error('Error fetching Substack posts:', error);
    return [];
  }
}

function parseRSSItems(xml: string): SubstackItem[] {
  const items: SubstackItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    const item: SubstackItem = {
      title: extractTag(itemContent, 'title'),
      link: extractTag(itemContent, 'link'),
      pubDate: extractTag(itemContent, 'pubDate'),
      'content:encoded': extractTag(itemContent, 'content:encoded'),
      description: extractTag(itemContent, 'description'),
      guid: extractTag(itemContent, 'guid'),
    };

    // Extract categories
    const categoryRegex = /<category>(.*?)<\/category>/g;
    const categories: string[] = [];
    let catMatch;
    while ((catMatch = categoryRegex.exec(itemContent)) !== null) {
      categories.push(catMatch[1]);
    }
    if (categories.length > 0) {
      item.categories = categories;
    }

    items.push(item);
  }

  return items;
}

function extractTag(content: string, tag: string): string {
  const regex = new RegExp(`<${tag}(?:[^>]*)><!\\[CDATA\\[(.*?)\\]\\]></${tag}>`, 's');
  const cdataMatch = content.match(regex);
  if (cdataMatch) return cdataMatch[1];

  const simpleRegex = new RegExp(`<${tag}(?:[^>]*)>(.*?)</${tag}>`, 's');
  const match = content.match(simpleRegex);
  return match ? match[1].trim() : '';
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

function extractFirstImage(html: string): string {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = html.match(imgRegex);
  return match ? match[1] : '';
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function calculateReadTime(content: string): string {
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200); // Average reading speed
  return `${minutes} min`;
}
