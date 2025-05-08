import { useSelector } from "react-redux";
import { getUrlParams } from "./getUrlParams";
import axios from "axios";

const useFetch=()=>{
    const {token}=useSelector((state)=>state.chat) 
    const authHeader={
        headers:{
            Authorization:`Bearer ${token}`,
        }
       }
    async function  fetchData(apiUrl,query,chatID){
           
        try{
             //const url='https://sphinx.shrmpro.com'
             const {userName,baseURL,customerID} =getUrlParams();
             const resp = await axios.post(`${apiUrl}`, {
                 query: query,
                 baseurl: baseURL || 'https://sphinx.shrmpro.com',
                 num_results: chatID|| 1,
                 company_id: customerID || 1,
                 username: userName || "cpro@sphinxworldbiz.co",
                chat_history:[],
                client_id:1
                },
             authHeader);
               return resp;
         }
         catch(err){
             console.log(err)
            // throw new err;
         }
}

return {fetchData}
}
export default useFetch;