"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useRef, useState } from "react"
import JobFilters from "@/features/jobs/job-filters/components/FiltersToolbars"
import { Job } from "../types"
import { Button } from "@/components/ui/button"
import { Building2, Save, X } from "lucide-react"
import { useFilters } from "@/features/jobs/job-filters/hooks/useFilters"
import ExportToPdf from "@/features/pdf-export/components/ExportToPdf"
import UpdateJobStatusButtons from "./UpdateJobStatusButtons"
import { useSelectRows } from "../hooks/useSelectRows"
import { FileImportForm } from "../../jobs-import/components/ImportForm"
import { bulkUpdateJobStatuses } from "../server-actions/bulkUpdateJobStatus"
import ManuelJobImport from "../../jobs-import/components/ManuelJobImport"
import ImportGuideModal from "../../jobs-import/components/ImportGuideModal"
import { getBadgeLightColor } from "@/helpers"

export function JobsTable({ jobs }: { jobs: Job[], isLoading: boolean }) {
  const { filteredData: jobsToDisplay, isStatusChanged, query, setQuery, changeStatus, setIsStatusChanged } = useFilters(jobs, "JOBS");
  const { checkAllRows, checkSingleRow, selectedRows } = useSelectRows();
  const updateFormRef = useRef<HTMLFormElement | null>(null);
  const tableRef = useRef<any>(null);
  const [isTableReady, setIsTableReady] = useState(false);

  useEffect(() => {
    if (tableRef.current) {
      setIsTableReady(true);
    }
  }, []);

  return (
        <main className="w-full">
          <form ref={updateFormRef} action={bulkUpdateJobStatuses} className="w-full">
          <section className="w-full grid gap-5 p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
            <div className="grid gap-1 w-full border-b py-3">
              <h1 className="font-bold text-2xl">Applied Jobs</h1>
              <p className="text-muted-foreground text-sm">Manage and track all your job applications in one place</p>
            </div>
            
            <div className="flex items-center w-full justify-between">
              <JobFilters filterType="JOBS" changeStatus={changeStatus} searchTerm={query} isDisabled={isStatusChanged} handleSearch={(e: any) => setQuery(e.target.value)}  />
            </div>

            <div className="flex w-full justify-start">
              {isTableReady && 
              <div className="flex">
                {selectedRows.length === 0 && !isStatusChanged && (
                  <div className="flex gap-2">
                    <ManuelJobImport isDisabled={selectedRows.length > 0} />
                    <ExportToPdf isDisabled={selectedRows.length > 0} elementRef={tableRef.current} />
                    <FileImportForm isDisabled={selectedRows.length > 0} />
                    <ImportGuideModal />
                  </div>
                )}

                {selectedRows.length > 0 && !isStatusChanged && (
                  <UpdateJobStatusButtons selectedRows={selectedRows} />
                )}

              {isStatusChanged && (
                <div className="flex gap-2">
                  <Button type="button" onClick={() => { updateFormRef.current?.reset(); setIsStatusChanged(false) } } size={'lg'}><X />Cancel</Button>
                  <Button size={'lg'} type="submit" className="bg-green-500 hover:bg-green-600"><Save />Save Changes</Button>
                </div>
              )}
              </div>
              }
            </div>
          </section>

          <Table ref={tableRef} className="mt-5 bg-white dark:bg-sidebar rounded-lg shadow-md">
            <TableCaption>A list of your recent job applications.</TableCaption>
            <TableHeader>
              <TableRow data-html2canvas-ignore>
                <TableHead><input data-html2canvas-ignore checked={selectedRows.length === jobs.length} onChange={(e) => checkAllRows(e, jobs)} type="checkbox" /></TableHead>
                <TableHead className="w-[100px] flex items-center gap-2 font-bold">Company</TableHead>
                <TableHead className="font-bold">Applied At</TableHead>
                <TableHead className="font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobsToDisplay.map((job: Job) => (
                <TableRow className={`${selectedRows.includes(job.id) ? 'bg-accent' : ''}`} key={job.id}>
                  <TableCell><input data-html2canvas-ignore value={job.id} checked={selectedRows.includes(job.id)} onChange={(e) => checkSingleRow(e, job.id)} type="checkbox" /></TableCell>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell className="font-medium text-muted-foreground">{new Date(job.appliedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="dark:text-black">
                    <input type="hidden" name="ids" value={job.id} />
                    <select onChange={() => setIsStatusChanged(true)} className={`cursor-pointer w-28 p-1 rounded-2xl ${getBadgeLightColor(job.status)} bg-accent`} defaultValue={job.status} name={`status-${job.id}`}>
                      <option value={job.status}>• {job.status}</option>
                      {job.status === "APPLIED" || job.status === "INTERVIEW" ? (
                        <>
                          <option value="REJECTED">REJECTED</option>
                          <option value="INTERVIEW">INTERVIEW</option>
                          <option value={"OFFER"}>OFFER</option>
                        </>
                      ) : null}
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter data-html2canvas-ignore>
              <TableRow>
                <TableCell colSpan={5}><span className="font-medium">Total {jobsToDisplay.length}</span></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </form>
      </main>
  )
}
