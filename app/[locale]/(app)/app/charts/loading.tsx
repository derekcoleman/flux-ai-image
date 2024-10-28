import { DashboardHeader } from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChartsLoading() {
  return (
    <>
      <DashboardHeader heading="Charts" />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
