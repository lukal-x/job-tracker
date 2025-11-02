import { FileImportButtons } from "@/components/FileImportButtons";
import { TableDemo } from "@/components/ui/TableDemo";
import { db } from "@/lib/db";

export default async function Home() {
  let jobs: any[] = [];

  try {
    jobs = await db.job.findMany();
    console.log("Jobs:", jobs);
  } catch (error) {
    console.error("Greška pri pristupu bazi:", error);
  }

  return (
    <div className="w-full h-screen flex justify-center overflow-hidden">
      <div className="w-5xl mt-20 overflow-hidden">
        <FileImportButtons />
        <TableDemo />
      </div>
    </div>
  );
}
