"use client"
import { formatISO, subDays } from 'date-fns'
import { useStats } from "@/features/stats/hooks/useStats"
import { useState } from "react"
import Loader from '@/components/Loader'
import JobChart from '@/features/stats/components/JobChart'
import JobStatsGrid from '@/features/stats/components/JobStatsGrid'
import StatsNav from '@/features/stats/components/StatsNav'
import { useFirebaseUser } from '@/hooks/useFirebaseUser'

const ranges = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  } as const;

export default function StatsPage(){
    const { token, loading: isUserLoading } = useFirebaseUser();
    const [range, setRange] = useState<keyof typeof ranges>("7d")
    const endDate = formatISO(new Date(), { representation: "date" })
    const startDate = formatISO(subDays(new Date(), ranges[range]), { representation: "date" })
    const { data, isLoading } = useStats(token, startDate, endDate);

    if(isLoading || isUserLoading){
        return <Loader type='NORMAL' />
    }

    if(!token){
        return (
            <div className="w-full h-[60vh] flex justify-center items-center">
                <span className="text-gray-400 text-2xl font-semibold">Sign in to see you recent application statistics.</span>
            </div>
        )
    }

    return(
        <main className="w-full h-full flex justify-center items-center">
            <section className="md:w-5xl w-xs p-3 grid place-items-center gap-5">
                <StatsNav onChange={(e) => setRange(e.target.value as keyof typeof ranges)} range={range} />
                <JobChart data={data} />
               <JobStatsGrid data={data} />
            </section>
        </main>
    )
}