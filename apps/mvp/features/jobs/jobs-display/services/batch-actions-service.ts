import axios from "axios";

export async function updateRecordsStatus(ids: string[], status: "APPLIED" | "REJECTED" | "INTERVIEW" | "OFFER"){
    try{
        return axios.patch('/api/batch', { recordIds: ids, status })
    }
    catch(err){
        throw new Error("Error while updating records");
    }
}

export async function deleteRecords(recordsIds: string[]){
    try{
        return axios.request({
            url: '/api/batch',
            method: 'DELETE',
            data: { recordsIds }
          });
    }
    catch(err){
        throw new Error("Error while deleting records");
    }
}