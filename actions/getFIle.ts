"use server"

import { db } from "@/lib/db";

export async function getFile(formData: FormData){
    const file = formData.get("text") as File;
    const text = await file.text();
    const jobs = text.split('-');
    jobs.forEach(async (title) => {
        await db.job.create({
            data: { title }
        })
    })
    console.log("@ FILE", jobs)
}