import axios from "axios";

export async function postSingleJob(data: any, token: string | null){
    try{
        await axios.post('/api/jobs/single', { data }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }
    catch(err){
        throw new Error("Error while posting job");
    }
}