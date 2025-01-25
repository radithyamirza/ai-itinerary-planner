import Plan from "@/components/features/plan";
import { getPlan } from "@/server/plans";

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const plan = await getPlan((await params).id);
  return <Plan plan={plan} />;
}
