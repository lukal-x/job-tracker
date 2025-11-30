import { db } from "@/lib/db";
import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try{
        const body = await req.json();
        const { company, appliedAt } = body.data;

        console.log("@DATA sent to server", company, appliedAt)

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
        
        const user = await db.user.findUnique({
          where: { firebaseUid: userData.uid }
        });

        if(!user){
          return NextResponse.json({ error: "User dont exist!"}, { status: 404 });
        }

        if(!company){
            return NextResponse.json({ error: "Company name is required! "}, { status: 400 });
        }

        const _newJob = await db.job.create({
            data: {
                title: company,
                userId: user.id,
                appliedAt: appliedAt
            }
        });

        return NextResponse.json({ succes: true }, { status: 201 });
    }
    catch(err){
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}