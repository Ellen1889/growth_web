import { Client } from '@notionhq/client';
import { Experiment, Review, Term, Tool, Reflection, ContentType, Prompt } from '@/types';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Helper to get clean text from rich text objects
const getRichText = (richText: any[]) => {
  return richText?.map((t: any) => t.plain_text).join('') || '';
};

// Helper to fetch all blocks (content) from a Notion page
export const getPageBlocks = async (pageId: string): Promise<any[]> => {
  try {
    const blocks = [];
    let cursor;

    while (true) {
      const response: any = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
      });

      blocks.push(...response.results);

      if (!response.has_more) {
        break;
      }

      cursor = response.next_cursor;
    }

    return blocks;
  } catch (error) {
    console.error('Error fetching page blocks:', error);
    return [];
  }
};

// --- EXPERIMENTS ---
export const getExperiments = async (): Promise<Experiment[]> => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_EXPERIMENTS!,
    });

  return response.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      title: props.Name.title[0]?.plain_text || 'Untitled',
      problem: getRichText(props.Problem.rich_text),
      hypothesis: getRichText(props.Hypothesis.rich_text),
      status: props.Status.select?.name || 'Inconclusive',
      metric: getRichText(props.Metric.rich_text),
      resultSummary: getRichText(props['Result Summary'].rich_text),
      date: props.Date?.date?.start || '',
    };
  });
  } catch (error) {
    console.error('Error fetching experiments:', error);
    return [];
  }
};

// --- REVIEWS ---
export const getReviews = async (): Promise<Review[]> => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_REVIEWS!,
    });

  return response.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      title: props.Title.title[0]?.plain_text || 'Untitled',
      contributor: getRichText(props.Source?.rich_text) || '',
      rating: props.Rating.number || 0,
      takeaways: getRichText(props.Takeaways?.rich_text) || '',
      type: props.Category.select?.name as ContentType || 'Article',
      tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
      url: props.URL.url || '#',
      coverImage: props['Cover Image']?.files[0]?.file?.url || props['Cover Image']?.files[0]?.external?.url || '',
      datePublished: props['Published Date']?.date?.start || '',
    };
  });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

// Get single review by ID
export const getReviewById = async (id: string): Promise<Review | null> => {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const props = (page as any).properties;

    return {
      id: page.id,
      title: props.Title.title[0]?.plain_text || 'Untitled',
      contributor: getRichText(props.Source?.rich_text) || '',
      rating: props.Rating.number || 0,
      takeaways: getRichText(props.Takeaways?.rich_text) || '',
      type: props.Category.select?.name as ContentType || 'Article',
      tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
      url: props.URL.url || '#',
      coverImage: props['Cover Image']?.files[0]?.file?.url || props['Cover Image']?.files[0]?.external?.url || '',
      datePublished: props['Published Date']?.date?.start || '',
    };
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
};

// --- NEWSLETTER ---
export const getNewsletter = async (): Promise<Reflection[]> => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_NEWSLETTER!,
    });

  return response.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      title: props.Title?.title[0]?.plain_text || 'Untitled',
      excerpt: getRichText(props.Excerpt?.rich_text),
      date: props.Date?.date?.start || '',
      readTime: '5 min',
      imageUrl: props['Cover Image']?.files[0]?.file?.url || props['Cover Image']?.files[0]?.external?.url || '',
      categories: props.Category?.multi_select?.map((cat: any) => cat.name) || [],
      url: props.URL?.url || (page as any).url || '',
    };
  });
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    return [];
  }
};

// --- KNOWLEDGE BASE ---
export const getTerms = async (): Promise<Term[]> => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_KNOWLEDGE!,
    });

  return response.results.map((page: any) => {
    const props = page.properties;
    const images = props.Images?.files?.map((file: any) =>
      file.file?.url || file.external?.url
    ).filter(Boolean) || [];

    return {
      id: page.id,
      term: props.Title?.title[0]?.plain_text || 'Untitled',
      definition: getRichText(props.Definition?.rich_text),
      category: props.Category?.select?.name || 'General',
      formula: getRichText(props.Formula?.rich_text),
      longDescription: getRichText(props['Long Description']?.rich_text),
      images: images,
      tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
      publishedDate: props['Published Date']?.date?.start || '',
      adoptionPriority: props['Adoption Priority']?.number || 0,
    };
  });
  } catch (error) {
    console.error('Error fetching terms:', error);
    return [];
  }
};

// Get single term by ID
export const getTermById = async (id: string): Promise<Term | null> => {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const props = (page as any).properties;
    const images = props.Images?.files?.map((file: any) =>
      file.file?.url || file.external?.url
    ).filter(Boolean) || [];

    return {
      id: page.id,
      term: props.Title?.title[0]?.plain_text || 'Untitled',
      definition: getRichText(props.Definition?.rich_text),
      category: props.Category?.select?.name || 'General',
      formula: getRichText(props.Formula?.rich_text),
      longDescription: getRichText(props['Long Description']?.rich_text),
      images: images,
      tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
      publishedDate: props['Published Date']?.date?.start || '',
      adoptionPriority: props['Adoption Priority']?.number || 0,
    };
  } catch (error) {
    console.error('Error fetching term:', error);
    return null;
  }
};

// --- TOOLS ---
export const getTools = async (): Promise<Tool[]> => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_TOOLS!,
    });

  return response.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      name: props.Title?.title[0]?.plain_text || 'Untitled',
      description: getRichText(props.Description?.rich_text),
      category: props.Category?.select?.name || 'General',
      url: props.URL?.url || '#',
      iconUrl: props.Icon?.files[0]?.file?.url || props.Icon?.files[0]?.external?.url || '',
      price: props.Price?.select?.name || 'Free',
      tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
      rating: props.Rating?.number || 0,
    };
  });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return [];
  }
};

// --- PROMPT LIBRARY ---
export const getPrompts = async (): Promise<Prompt[]> => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID_PROMPTS!,
    });

  return response.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      title: props.Title?.title[0]?.plain_text || 'Untitled',
      category: props.Category?.select?.name || 'General',
      tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
    };
  });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
};

// Get single prompt by ID
export const getPromptById = async (id: string): Promise<Prompt | null> => {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const props = (page as any).properties;

    return {
      id: page.id,
      title: props.Title?.title[0]?.plain_text || 'Untitled',
      category: props.Category?.select?.name || 'General',
      tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
    };
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return null;
  }
};
