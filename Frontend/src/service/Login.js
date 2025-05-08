import axios from "axios";
import { ENDPOINTS } from "./endpoint";

const Username=process.env.USERNAME;
const Password=process.env.PASSWORD;
   export const loginUser = async () => {    
    try {
        const response = await axios.post(`${ENDPOINTS}/login`, {
          username: "cpro@sphinxworldbiz.com",
          password: "sphinxecb123",
        });
        console.log("am response",response)
        const gettoken = response.data.data.access_token;
        return gettoken;
      } 
      
      catch (error) {
        console.log(error, "unable user login");
      }

    }
 


