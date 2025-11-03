import { useState } from "react";
import { Job } from "../../jobs-display/types/index"

export function useFilters(jobs: Job[]){
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [isStatusChanged, setIsStatusChanged] = useState(false);
    const jobsToDisplay = jobs.filter((job) => {
      const matchesQuery = query
          ? job.title.toLowerCase().includes(query.toLowerCase())
          : true;
      
        const matchesStatus = status
          ? job.status.toLowerCase() === status.toLowerCase()
          : true;
      
        return matchesQuery && matchesStatus;
    });

    return{
        query,
        status,
        isStatusChanged,
        jobsToDisplay,
        setQuery,
        setStatus,
        setIsStatusChanged
    }
}