import axios from "axios";
import { ENDPOINTS,username,password } from "./endpoint";



console.log(username)
   export const loginUser = async () => {    
    try {
        const response = await axios.post(`${ENDPOINTS}/login/`, {
          username: username,
          password: password,
        });
        console.log("am response",response.data.data)
        const gettoken = response.data.data.access_token;
        // const refreshToken = response.data.data.refresh_token;
        return gettoken;
      } 
      
      catch (error) {
        console.log(error, "unable user login");
      }

    }
 


