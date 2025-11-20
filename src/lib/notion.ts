import { Client } from '@notionhq/client';
import { Experiment, Review, Term, Tool, Reflection, ContentType } from '@/types';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Helper to get clean text from rich text objects
const getRichText = (richText: any[]) => {
  return richText?.map((t: any) => t.plain_text).join('') || '';
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
      author: getRichText(props.Author.rich_text),
      rating: props.Rating.number || 0,
      takeaways: props.Takeaways.multi_select.map((t: any) => t.name),
      type: props.Type.select?.name as ContentType || 'Article',
      tags: props.Tags.multi_select.map((t: any) => t.name),
      url: props.URL.url || '#',
      coverImage: props['Cover Image']?.files[0]?.file?.url || props['Cover Image']?.files[0]?.external?.url || '',
    };
  });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
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
    return {
      id: page.id,
      term: props.Term?.title[0]?.plain_text || 'Untitled',
      definition: getRichText(props.Definition?.rich_text),
      category: props.Category?.select?.name || 'General',
      formula: getRichText(props.Formula?.rich_text),
      longDescription: getRichText(props['Long Description']?.rich_text),
    };
  });
  } catch (error) {
    console.error('Error fetching terms:', error);
    return [];
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
      name: props.Name?.title[0]?.plain_text || 'Untitled',
      description: getRichText(props.Description?.rich_text),
      category: props.Category?.select?.name || 'General',
      url: props.URL?.url || '#',
      iconUrl: props.Icon?.files[0]?.file?.url || props.Icon?.files[0]?.external?.url || '',
      price: props.Price?.select?.name || 'Free',
    };
  });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return [];
  }
};
