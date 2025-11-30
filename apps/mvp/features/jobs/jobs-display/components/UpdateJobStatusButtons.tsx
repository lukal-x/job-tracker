import { Button } from '@/components/ui/button';
import { updateRecordsStatus, deleteRecords } from '@/features/jobs/jobs-display/services/batch-actions-service';
import { Mic, X, Trash } from 'lucide-react';

const UpdateJobStatusButtons = ({ selectedRows }: { selectedRows: string[]}) => {
  return (
    <div className="w-full mt-3 md:flex grid gap-2 items-center justify-between">
        <span className="font-medium">Selected Records ({selectedRows.length})</span>
        <div className="flex gap-2 items-center">
            <Button type="button" onClick={async () => {await updateRecordsStatus(selectedRows, "INTERVIEW"); location.reload()}} variant={'outline'}><Mic />Mark As Interview</Button>
            <Button type="button" onClick={async () => {await updateRecordsStatus(selectedRows, "REJECTED"); location.reload()}} variant={'outline'} size={'sm'}><X />Mark As Rejected</Button>
            <Button type="button" onClick={async () => {await deleteRecords(selectedRows); location.reload();}} variant={'destructive'} size={'sm'}><Trash />Delete {selectedRows.length} records</Button>
        </div>
    </div>
  )
}

export default UpdateJobStatusButtons