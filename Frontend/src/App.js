import Homepage from './components/Homepage';
// import Trial from "./components/Trial";
import { loginUser } from './service/Login';
import { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { setToken } from './store/chatSlice';
function App() {
  const {token}=useSelector((state)=>state.chat)  
   const dispatch=useDispatch();
   
   useEffect(() => {
     async function login(){
       const tokenVal=await loginUser();
       console.log("am token val",tokenVal)
       dispatch(setToken(tokenVal))
     }
     
     login();
 
   },[]);
   return <>{token && <Homepage />}</>;
 }
 
 export default App;