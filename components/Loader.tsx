import { Loader2 } from "lucide-react"

const Loader = () => {
  return (
    <div className="flex bg-white absolute z-50 left-0 top-0 overflow-hidden items-center justify-center w-full h-screen">
        <Loader2 size={30} className="animate-spin" />
    </div>
  )
}

export default Loader