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

export function JobsTable({ jobs, isLoading }: { jobs: Job[], isLoading: boolean }) {
  const { filteredData: jobsToDisplay, isStatusChanged, query, status, setQuery, setStatus, setIsStatusChanged } = useFilters(jobs, "JOBS");
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
        <>
          <div className="flex w-full justify-between">
            {isTableReady && 
              <ExportToPdf isDisabled={selectedRows.length > 0} elementRef={tableRef.current} />
            }
            <div className="flex gap-2 items-center">
              <ImportGuideModal />
              <FileImportForm isDisabled={selectedRows.length > 0} />
              <ManuelJobImport isDisabled={selectedRows.length > 0} />
            </div>
          </div>

          <form ref={updateFormRef} action={bulkUpdateJobStatuses} className="w-full">
          <div className="md:flex items-center grid w-full justify-between">
            <JobFilters filterType="JOBS" status={status} searchTerm={query} isDisabled={isStatusChanged} handleSearch={(e) => setQuery(e.target.value)} reset={() => { setStatus(""); setQuery("") } } showApplied={() => setStatus("APPLIED")} showInterview={() => setStatus("INTERVIEW")} showRejected={() => setStatus("REJECTED")} />
            {isStatusChanged && (
              <div className="flex gap-2 md:ml-2 mt-2">
                <Button type="button" onClick={() => { updateFormRef.current?.reset(); setIsStatusChanged(false) } } size={'lg'}><X />Cancel</Button>
                <Button size={'lg'} className="bg-green-500 hover:bg-green-600"><Save />Save Changes</Button>
              </div>
            )}
          </div>

          {selectedRows.length > 0 && (
            <UpdateJobStatusButtons selectedRows={selectedRows} />
          )}
          <Table ref={tableRef} className="mt-5 border">
            <TableCaption>A list of your recent job applications.</TableCaption>
            <TableHeader>
              <TableRow data-html2canvas-ignore>
                <TableHead><input data-html2canvas-ignore checked={selectedRows.length === jobs.length} onChange={(e) => checkAllRows(e, jobs)} type="checkbox" /></TableHead>
                <TableHead className="w-[100px] flex items-center gap-2"><Building2 size={20} strokeWidth={1} />Company</TableHead>
                <TableHead>Applied At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobsToDisplay.map((job: Job) => (
                <TableRow className={`${selectedRows.includes(job.id) ? 'bg-accent' : ''}`} key={job.id}>
                  <TableCell><input data-html2canvas-ignore value={job.id} checked={selectedRows.includes(job.id)} onChange={(e) => checkSingleRow(e, job.id)} type="checkbox" /></TableCell>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell className="font-medium">{new Date(job.appliedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="dark:text-black">
                    <input type="hidden" name="ids" value={job.id} />
                    <select onChange={() => setIsStatusChanged(true)} className={`cursor-pointer w-28 p-1 rounded-md dark:bg-white bg-accent`} defaultValue={job.status} name={`status-${job.id}`}>
                      <option value={job.status}>• {job.status}</option>
                      {job.status === "APPLIED" ? (
                        <>
                          <option value="REJECTED">REJECTED</option>
                          <option value="INTERVIEW">INTERVIEW</option>
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
      </>
  )
}
