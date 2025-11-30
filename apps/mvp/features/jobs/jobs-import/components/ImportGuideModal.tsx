import { AlertDialogHeader, AlertDialogFooter, AlertDialogContent } from '@/components/ui/alert-dialog'
import { AlertDialog, AlertDialogCancel, AlertDialogDescription, AlertDialogTitle } from '@radix-ui/react-alert-dialog'

const ImportGuideModal = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: any }) => {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={isOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>How to import applied jobs?</AlertDialogTitle>
            <AlertDialogDescription>
            1. In order to import the applied jobs, <b>please click on the "Import" button.</b> <br /> <br />
            2. And select the .txt document that contains the names of the companies you recently applied to. <br /> <br />
            <b>**IMPORTANT** Please put a "-" character between each job title/company name.</b>
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default ImportGuideModal