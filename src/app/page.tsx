import { getExperiments, getReviews, getNewsletter } from '@/lib/notion';
import DashboardContent from './DashboardContent';

// Revalidate data every 60 seconds
export const revalidate = 60;

export default async function Home() {
  const [experiments, reviews, newsletter] = await Promise.all([
    getExperiments(),
    getReviews(),
    getNewsletter(),
  ]);

  // Show latest experiments (sorted by published date)
  const latestExperiments = experiments.sort((a, b) => {
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });

  return <DashboardContent runningExperiments={latestExperiments} reviews={reviews} newsletter={newsletter} />;
}
