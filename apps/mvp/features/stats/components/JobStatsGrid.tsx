import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { FileText, Mic, X, CalendarCheck, Calendar1 } from 'lucide-react'
import { StatsData } from '../types'

const JobStatsGrid = ({ data }: { data: StatsData | undefined }) => {
  return (
    <section className='grid w-full lg:grid-cols-3 gap-3'>
        <Card className='gird place-items-center text-applied-text'>
                <CardTitle className='flex items-center gap-2'><FileText strokeWidth={1} />Total Applied</CardTitle>
            <CardContent>
                <b className='text-xl'>{data?.totalApplies}</b>
            </CardContent>
        </Card>
        <Card className='gird place-items-center text-yellow-500'>
                <CardTitle className='flex gap-2 items-center'><Calendar1 strokeWidth={1} />Total Acitve Days</CardTitle>
            <CardContent>
                <b className='text-xl'>{data?.activeDays.length}</b>
            </CardContent>
        </Card>
        <Card className='gird place-items-center text-interview-text'>
                <CardTitle className='flex gap-2 items-center'><Mic strokeWidth={1} />Total Interviews</CardTitle>
            <CardContent>
                <b className='text-xl'>{data?.totalInterviews.length}</b>
            </CardContent>
        </Card>
        <Card className='gird place-items-center text-rejected-text'>
                <CardTitle className='flex gap-2 items-center'><X strokeWidth={1} />Total Rejections</CardTitle>
            <CardContent>
                <b className='text-xl'>{data?.totalRejected.length}</b>
            </CardContent>
        </Card>
        <Card className='gird place-items-center text-green-500'>
                <CardTitle className='flex gap-2 items-center'><CalendarCheck strokeWidth={1} />Average Applies</CardTitle>
            <CardContent>
                <b className='text-xl'>{data?.averageAppliesPerDay} / <span className='font-normal text-lg'>per day</span></b>
            </CardContent>
        </Card>
        <Card className='gird place-items-center text-orange-500'>
                <CardTitle className='flex gap-2 items-center'>% Interviews Percentage Rate</CardTitle>
            <CardContent>
                <b className='text-xl'>{data?.interviewsPercentage} %</b>
            </CardContent>
        </Card>
    </section>
  )
}

export default JobStatsGrid