import Homepage from './components/Homepage';
// import Trial from "./components/Trial";
import { loginUser } from './service/Login';
import { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { setToken } from './store/chatSlice';
import axios from 'axios';
function App() {
  const {token}=useSelector((state)=>state.chat)  
   const dispatch=useDispatch();
   
   useEffect(() => {
  const intervalId = setInterval(() => {
    async function login() {
      const tokenVal = await loginUser();
      dispatch(setToken(tokenVal));
    }

    login();
  }, 600000); 

  
  async function initialLogin() {
    const tokenVal = await loginUser();
    dispatch(setToken(tokenVal));
  }

  initialLogin();

  // Cleanup
  return () => clearInterval(intervalId);
}, [dispatch]);

   return <>
   {token?(<Homepage />):(<div>yooooo</div>)}
   </>
  // return <>
  // {token?(<div>yooooo</div>):(<Homepage />)}
  // </>

 }
 
 export default App;