import { Input } from "@/components/ui/input";
import { Filters } from "../types";
import { Search } from "lucide-react";

export default function FiltersToolbar({ filterType,searchTerm, isDisabled, handleSearch, changeStatus}: Filters){
  return (
      <div className="md:flex w-full items-center grid gap-2">
        <div className="relative md:w-full w-96">
          <Search className="absolute text-gray-400 top-1.5 left-2" />
          <Input disabled={isDisabled} value={searchTerm} onChange={handleSearch} className="w-full bg-accent h-10 border px-10" placeholder="Search companies..." />
        </div>
          {filterType === 'JOBS' && (
            <select defaultValue={""} onChange={(e) => changeStatus(e.target.value)} className={`cursor-pointer h-10 w-28 p-1 border rounded-md bg-accent`}>
                <option value="">All Status</option>
                <option value={"APPLIED"}>Applied</option>
                <option value={"REJECTED"}>Rejected</option>
                <option value={"INTERVIEW"}>Interview</option>
            </select>
          )}
        </div>
    )
  }