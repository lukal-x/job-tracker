import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { FileText, Mic, X, CalendarCheck, Calendar1 } from 'lucide-react'
import { StatsData } from '../types'
import { motion } from "framer-motion"
import AnimatedNumber from './AnimatedStats'

const JobStatsGrid = ({ data }: { data: StatsData | undefined }) => {
  return (
    <section className='grid w-full lg:grid-cols-5 gap-3'>
        <Card className='gird place-items-center text-blue-500'>
            <CardTitle className='flex items-center gap-2'>
                <FileText strokeWidth={1} />Total Applied
            </CardTitle>
            <CardContent>
                <AnimatedNumber value={data?.totalApplies ?? 0} />
            </CardContent>
        </Card>

        <Card className='gird place-items-center text-yellow-500'>
            <CardTitle className='flex gap-2 items-center'>
                <Calendar1 strokeWidth={1} />Total Active Days
            </CardTitle>
            <CardContent>
                <AnimatedNumber value={data?.activeDays.length ?? 0} />
            </CardContent>
        </Card>

        <Card className='gird place-items-center text-interview-text'>
            <CardTitle className='flex gap-2 items-center'>
                <Mic strokeWidth={1} />Total Interviews
            </CardTitle>
            <CardContent>
                <AnimatedNumber value={data?.totalInterviews.length ?? 0} />
            </CardContent>
        </Card>

        <Card className='gird place-items-center text-red-400'>
            <CardTitle className='flex gap-2 items-center'>
                <X strokeWidth={1} />Total Rejections
            </CardTitle>
            <CardContent>
                <AnimatedNumber value={data?.totalRejected.length ?? 0} />
            </CardContent>
        </Card>

        <Card className='gird place-items-center text-green-500'>
            <CardTitle className='flex gap-2 items-center'>
                <CalendarCheck strokeWidth={1} />Average Applies
            </CardTitle>
            <CardContent>
                <AnimatedNumber value={data?.averageAppliesPerDay ?? 0} /> 
                <span className='font-normal text-lg'> / per day</span>
            </CardContent>
        </Card>

        <Card className='gird place-items-center text-orange-500'>
            <CardTitle className='flex gap-2 items-center'>
                % Interviews Rate
            </CardTitle>
            <CardContent>
                <AnimatedNumber value={data?.interviewsPercentage ?? 0} /> %
            </CardContent>
        </Card>

    </section>
  )
}

export default JobStatsGrid