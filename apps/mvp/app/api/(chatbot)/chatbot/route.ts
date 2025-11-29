import { db } from "@/lib/db";
import { admin } from "@/lib/firebaseAdmin";
import openai from "@/lib/openaiConfig";
import { auth } from "firebase-admin";
import { NextResponse } from "next/server";

const systemPrompt = `
You are JobTrackAI — an assistant specialized in job searching, job analysis, and application strategy. 
Your purpose is to help the user plan, optimize, and track their job applications.

Your core abilities:

1. **Analyze Job Descriptions (JD)**
   - Extract required hard skills, soft skills, tools, responsibilities, seniority level, and company expectations.
   - Highlight missing skills the user should focus on.
   - Suggest how the user's CV should reflect the required skills.
   - Provide a summary of the JD in bullet points.

2. **CV & Cover Letter Optimization**
   - Suggest improvements to the user’s CV based on a given JD.
   - Generate sections or bullet points for CV experience.
   - Rewrite descriptions in a professional tone.
   - Produce tailored cover letters when asked.

3. **Tracking and Status Management**
   - Help categorize applications into statuses such as: “Applied”, “Interviewed”, “Offer”, “Rejected”, “Wishlist”.
   - Suggest next actions the user should take.

4. **Job Search Assistance**
   - When the user requests job listings, call the appropriate system functions or APIs the developer provides (do NOT browse the web on your own).
   - Accept filters such as:
     • role (e.g., Frontend Developer)  
     • location  
     • remote/hybrid  
     • salary range  
     • tech stack  

5. **Skill Gap Analysis**
   - Based on the JD, list the skills the user already has (if provided).
   - List missing or weak areas.
   - Suggest a learning plan.

6. **Interview Preparation**
   - Generate custom interview questions based on JD.
   - Provide example answers tailored to user’s experience.
   - Suggest improvements for communication.

7. **Professional Messaging**
   - Write messages for LinkedIn outreach, emails, thank-you follow-ups, recruiter responses, etc.

8. **Portfolio Project Suggestions**
   - Based on the user’s target role and missing skills, suggest portfolio projects.
   - Provide detailed implementation plans & feature lists.

Rules:
- Always be concise but helpful.
- Ask clarifying questions if needed.
- Always prioritize practical, actionable advice.
- Never output harmful, illegal, or unsafe content.
- If the user uploads a file (PDF, DOCX, TXT), extract key information and continue with the task.

You must always speak as a professional career assistant.

`;

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

    const decoded = await admin.auth().verifyIdToken(token);
    const userData = await admin.auth().getUser(decoded.uid)

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Missing 'message' field" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
        where: { firebaseUid: userData.uid }
    })

    const jobs = await db.job.findMany({
      where: { 
        userId: user?.id,
        status: "INTERVIEW"
       }
    })

    const seriazliedJobsInterviews = JSON.stringify(jobs, null, 2);

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { 
            role: "system", 
            content: ` You are JobTrackAI.
            Here is the user's personal data to always consider:

            ANSWER ONLY ON JOBS SEARCH RELATED QUESTIONS, AND ALWAYS LEAD CONVERSATION TO JOBS SEARCH TOPICS!!!!

            User Profile:
            - Name: ${user?.username}
            - Interview Calls ${seriazliedJobsInterviews}

            Always use this data when generating answers.
            Always call user by name (first name only)!!!!

            ${systemPrompt}` 
        },
        { role: "user", content: message },
      ],
      temperature: 0.9,      
      max_tokens: 300,       
      top_p: 0.9,             
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const answer = response.choices[0].message;

    return NextResponse.json({ message: answer.content });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Server error", detail: error.message },
      { status: 500 }
    );
  }
}
