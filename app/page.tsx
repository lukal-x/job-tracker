"use client"
import { JobsTable } from "@/features/jobs/jobs-display/components/JobsTable";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/features/jobs/jobs-display/services/jobs-display-service";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

export default function Home() {
  const { user, token } = useFirebaseUser();
  const { data, isLoading } = useQuery({
    queryKey: ['jobs', user?.email],
    queryFn: () => fetchJobs(token),
    staleTime: 60 * 5000,
    enabled: !!token
  })

  if(isLoading){
    return <Loader type="NORMAL" />
  }

  return (
    <main className="w-full h-screen flex justify-center items-start overflow-auto">
      <div className="w-5xl p-3 grid place-items-center gap-5">
        <JobsTable isLoading={isLoading} jobs={data?.jobs ?? []} />
      </div>
    </main>
  );
}
