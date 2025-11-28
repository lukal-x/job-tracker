import { db } from "@/lib/db";
import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    try{
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

        const jobs = await db.job.findMany({
          where: { userId: user.id },
          orderBy: { appliedAt: "desc"}
        });

        return NextResponse.json({ jobs }, { status: 200});
    }
    catch(err){
        return NextResponse.json({ error: err }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
      const authHeader = req.headers.get("Authorization");
      
      if (!authHeader) {
        return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      // get user data and uid
      const decoded = await admin.auth().verifyIdToken(token);
      const userData = await admin.auth().getUser(decoded.uid)

      const formData = await req.formData();
      const file = formData.get("text") as File;
  
      if (!file) {
        return NextResponse.json({ error: "No file received" }, { status: 400 });
      }
  
      const text = await file.text();
      const jobs = text
        .split("-")
        .map((title) => title.trim())
        .filter((title) => title.length > 0);
  
      await Promise.all(
        jobs.map((title) =>
          db.job.create({ data: { title, status: "APPLIED", userId: userData.uid  } })
        )
      );
  
      return NextResponse.redirect(new URL("/", req.url));
    } catch (err) {
      console.error("Upload error:", err);
      return NextResponse.json({ error: "Uploaded file contains duplicates!" }, { status: 500 });
    }
  }