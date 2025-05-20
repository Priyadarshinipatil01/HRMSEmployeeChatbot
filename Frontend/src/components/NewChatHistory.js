import { useDispatch, useSelector } from "react-redux";
import { clearAnswer,setInputVal,setClear,updateChatHistory,setChatID, addAnswer} from "../store/chatSlice";
import './Homepage.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import { useEffect } from "react";
import axios from "axios";
import { ENDPOINTS } from "../service/endpoint";
import { getUrlParams } from "../service/getUrlParams";

//const url=`http://164.52.205.159:8013`;


function NewChatHistory(){
  const {userName,baseURL,customerID} =getUrlParams();
    const dispatch=useDispatch();
    const  {answer,chatHistory,chatID,token}=useSelector((state)=>state.chat)
    const authHeader={
      headers:{
          Authorization:`Bearer ${token}`,
      }
     }
    const newChat = async() => {
       await getchatId();
        dispatch(clearAnswer());
        dispatch(setClear(true));
        dispatch(setInputVal(""))
        
      };
     
    const addChats = async () => {
                try {
                 // console.log("am answer to update chat",answer)
               const result=answer.filter((val)=>val?.User_query_type==="other")
                // console.log("am yo yo result",result) 
                 if(result.length>0){
                 const json = JSON.stringify(result);
                 await axios.post(`${ENDPOINTS}/insert/chat_history`, 
                  
                  {
                    chat_content: json,
                    chat_id: chatID,
                    "company_id": 1,
                    "client_id": 1,
                    "username": userName || "cpro@sphinxworldbiz.co",
                  },
                authHeader);

               // dispatch(clearAnswer());
                }
                } catch (error) {
                  console.log(error);
                }
              };
  

        const getChats=async ()=>{
          try{
           
            const resp=await axios.post(`${ENDPOINTS}/get/chat_history`, 
            {
              "company_id": 1,
              "client_id": 1,
              "username": userName || "cpro@sphinxworldbiz.co",
            },
            authHeader); 
          //  console.log("am resp from getchat", resp);
            if(!resp.data.error){
            const jsonArray=resp.data.data.map((val)=>{
              return {
                id:val.chatid,
                chat:(val.chat)}})

            //console.log("am json arr from getchat", jsonArray)
             dispatch(updateChatHistory(jsonArray))

              }

              else{
                console.log("am resp", resp)
              }
              }
          catch(err){

            console.log("am error", err);
          }
        }
  
        const getchatId=async()=>{
          try{
           
            const resp=await axios.post(`${ENDPOINTS}/get/new_chat_id`, {
              "company_id": 1,
              "client_id": 1,
              "username": userName || "cpro@sphinxworldbiz.co",
            },
            authHeader); 
            dispatch(setChatID(resp.data.data.new_chat_id))
            //console.log("am id", resp)
          }
          catch(err){
            console.log(err);
          }
        }
         useEffect(()=>{
          const fetchId=async()=>{
             await getchatId();
          }
          fetchId()
          
        },[])
  
          useEffect(()=>{
            const fetchData=async()=>{
                if(answer.length>0)
                await addChats();
  
             await getChats();
            }
            fetchData()
          
        },[answer])

       

        const updateChat=(chat)=>{
               dispatch(clearAnswer());
               dispatch(setChatID(chat.id));
               dispatch(setClear(false));
               dispatch(setInputVal(""));

             chat.chat.forEach(element => {
              dispatch(addAnswer(element));
           });
        }

        const deleteChat=async(id)=>{
          try{
           

            
          await axios.post(`${ENDPOINTS}/chat/delete`, {
            "username": userName || "cpro@sphinxworldbiz.co",
            "company_id": 1,
            "client_id": 1,
            "chat_id": id
          },
            authHeader); 
           await getChats();
            if(chatHistory.length===1){
              dispatch(updateChatHistory([]));
             await newChat();
            }
          
        }
          catch(err){
            console.log(err);
          }
        }

        const deleteAllChat=async()=>{
          try{
            
 
           await axios.post(`${ENDPOINTS}/chats/delete`, {
              username: userName || "cpro@sphinxworldbiz.co",
              "company_id": 1,
              "client_id": 1
            },
            authHeader);  
          await newChat();
           dispatch(updateChatHistory([]));      
          
        }
          catch(err){
            console.log(err);
          }
        }



    return(
        <div className="sidebar">
        <div className="chats">
          <button className="btn btn-primary" onClick={() => newChat()}>
            <i className="fa fa-plus-circle"></i> New Chat
          </button>
        </div>

        <div className="previous-chat">
      <h1>History</h1>
      <ul>
        {chatHistory.length > 0 &&
          chatHistory.map((chats, i) => {
            const content = chats.chat[0].content;
            return (
              <li key={i}>
                <div onClick={() => updateChat(chats)}>{content}</div>
                <button onClick={() => deleteChat(chats.id)}>
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
              </li>
            );
          })}

        <button
        onClick={()=>deleteAllChat()}
        >
        Delete All 
      </button>
      </ul>
   
    </div>
        <div className="profile">
          <button className="tab" data-call="upgrade">
            Upgrade to Premium
          </button>
          <button className="tab">mail@sphinxworldbiz.com</button>
        </div>
      </div>
    )

}
export default NewChatHistory