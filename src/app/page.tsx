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

  const runningExperiments = experiments.filter(e => e.status === 'Running');

  return <DashboardContent runningExperiments={runningExperiments} reviews={reviews} newsletter={newsletter} />;
}
