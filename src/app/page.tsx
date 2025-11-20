import { getExperiments, getReviews, getNewsletter, getTerms, getTools } from '@/lib/notion';
import DashboardClient from '@/components/DashboardClient';

export default async function Home() {
  const [experiments, reviews, newsletter, terms, tools] = await Promise.all([
    getExperiments(),
    getReviews(),
    getNewsletter(),
    getTerms(),
    getTools()
  ]);

  return (
    <main>
      <DashboardClient 
        initialExperiments={experiments}
        initialReviews={reviews}
        initialNewsletter={newsletter}
        initialTerms={terms}
        initialTools={tools}
      />
    </main>
  );
}