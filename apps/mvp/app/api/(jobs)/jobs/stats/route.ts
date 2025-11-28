import { db } from "@/lib/db";
import { admin } from "@/lib/firebaseAdmin";
import { format } from "date-fns";
import { NextResponse } from "next/server";


// **TODO** Error is beacuse of when we have no jobs application in time range we still iterate or mutate empty data causing erros
export async function GET(req: Request){
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const userData = await admin.auth().getUser(decoded.uid)
        
    console.log("@USER FIREBASE ID", userData.uid)
    const user = await db.user.findUnique({
        where: { firebaseUid: userData.uid }
    });

    console.log("@USER ID ", user?.id)

    if(!user){
        return NextResponse.json({ error: "User dont exist!"}, { status: 404 });
    }
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if(!start || !end){
        return NextResponse.json({ error: "Missing date range" }, { status: 400 });
    }

    console.log("@BEFORE DB QUERY")

    try{
        const jobs = await db.job.findMany({
            where: {
                userId: user.id,
                appliedAt: {
                    gte: new Date(start),
                    lte: new Date(end)
                }
            },
            orderBy: {
                appliedAt: 'asc'
            }
        });

        console.log("@AFTER QUERY JOBS", jobs)


        const allAppliedDates = [jobs[0].appliedAt];

        // iterate through jobs and take one date for one day
        for (let i = 1; i < jobs.length; i++) {
            if (jobs[i].appliedAt.toISOString().split('T')[0] !== jobs[i - 1].appliedAt.toISOString().split('T')[0]) {
                allAppliedDates.push(jobs[i].appliedAt);
            }
        }

        console.log("@AFTER LOOP")

        // Data that will be send to client 
        //  1. Total Applies amount
        //  2. Total Rejected amount
        //  3. Total Interviews amount 
        //  4. All applying days (dates)
        //  5. Average applies per day
        //  6. Number of applies on each day
        //  7. All active days.
        //  8. Percentage of interview calls
        
        const totalApplies = jobs.length;
        const totalRejected = jobs.filter((job) => job.status === "REJECTED");
        const totalInterviews = jobs.filter((job) => job.status === "INTERVIEW");
        const totalApplyingDays = allAppliedDates;
        const averageAppliesPerDay = Math.floor(totalApplies / allAppliedDates.length);
        const activeDays = allAppliedDates;
        const interviewsPercentage = totalApplies > 0 
            ? Math.floor((totalInterviews.length / totalApplies) * 100) 
            : 0;

        // Calculate the amount of applies for each applying day.
        const appliesPerDay: Record<string, number> = {};
        for(let i = 0; i < totalApplyingDays.length; i++){
            const jobsAppliedOnSameDate = jobs.filter((job) => job.appliedAt.toISOString().split('T')[0] === totalApplyingDays[i].toISOString().split('T')[0])
            appliesPerDay[format(totalApplyingDays[i], 'yyyy-MM-dd')] = jobsAppliedOnSameDate.length;
        }

        console.log("@AFTER LOOP #2")
        
        return NextResponse.json({ totalApplies, totalInterviews, totalRejected, averageAppliesPerDay, appliesPerDay, activeDays, interviewsPercentage }, { status: 200 });
    }
    catch(err){
        return NextResponse.json({ error: err }, { status: 500 });
    }
}