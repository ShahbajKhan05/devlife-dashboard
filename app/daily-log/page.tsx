import DailyLog from "@/components/DailyLog";
import { PageHeader, PageLayout } from "@/components/PageLayout";

export default function DailyLogPage() {
  return (
    <PageLayout className="space-y-6">
      <PageHeader
        eyebrow="Stay consistent"
        title="Daily Coding Log"
        description="Track your coding sessions, record what you learned and review your progress."
      />
      <DailyLog />
    </PageLayout>
  );
}
