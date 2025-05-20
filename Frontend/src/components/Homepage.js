import { setInputVal,
    addAnswer,
    setCircular,
    setClear,
    setError,
    updateAnswer,
 } from "../store/chatSlice";

 import axios from "axios";
 import React from "react";
 import { useDispatch,useSelector } from "react-redux";
 import { useRef, useEffect, useState } from "react";
 import ShowLanguage from "./ShowLanguage.js";
 import TypingEffect from "./TypingEffect.js";
 import useFetch from "../service/FetchData.js"
 import { getUrlParams } from "../service/getUrlParams.js";
import NewChatHistory from "./NewChatHistory.js";
import Circular from "./Circular.js";
import getDate from "../service/getDate.js"
import Input from "./Input.js";
import FormatTextWithBoldNumbersAndLinks from "./FormatTextWithBoldNumbersAndLinks.js";
import SkeletonCard from "./SkeletonCard.js";
import { ENDPOINTS } from "../service/endpoint.js";

 function Homepage(){
    const [languages,setLanguages]=useState([]);
    const{
        inputVal,
        answer,
        latestResponseIndex,
        error,
        clear,
        circular,
        token   
    }=useSelector((state)=>state.chat)
    const dispatch=useDispatch();
    const chatContainerRef=useRef(null);
    const bottomRef=useRef(null);
    const handleInput=(event)=>{
        dispatch(setInputVal(event.target.value));
    }
    const {fetchData,updateFeedback}=useFetch()
    const [feedbackStatus, setFeedbackStatus] = useState({});

    //const url = 'http://164.52.205.159:8013';
    const mainChat=async()=>{
        try{
 
            dispatch(setClear(false))
            dispatch(setCircular('visible'));
            dispatch(addAnswer({content:inputVal,type:'user'}))
            dispatch(setInputVal(""))


            const resp=await fetchData(`${ENDPOINTS}/main_with_chat_history_input/v1`,inputVal)
            if(resp.data.User_query_type==="other"){
              dispatch(updateAnswer({content:inputVal,type:'user',User_query_type:"other"}))
              
            }
            
            //console.log("am response",resp);
            if(resp.data.Error)
            {
                dispatch(setError(true))
                dispatch(addAnswer( { content: resp.data.Error, type: 'response' }))
            }
            else{
            dispatch(setError(false))
            dispatch(addAnswer({content:resp.data.Response,type:'response',flag:resp.data.Flag,pdfPath: resp.data.pdf_path,feedback_id:resp.data.feedback_id,User_query_type:resp.data.User_query_type}))
            }
        dispatch(setCircular('hidden')) 
            
        }
        catch(err)
        {
            console.log(err);
        }
    }


    const feedBack = async (type, itemId) => { 
      console.log(" feddbakc",itemId)
      setFeedbackStatus((prevStatus) => ({
        ...prevStatus,
        [itemId]: prevStatus[itemId] === type ? null :type,
        
      }));
      await updateFeedback(`${ENDPOINTS}/update_feedback`,type,itemId)

  };

    useEffect(() => {
        getUrlParams();
        async function fetchLanguage(){
            const response=await axios.post(`${ENDPOINTS}/show_languages`, {
              query: "Show all languages",   
            },
            { headers:{
              Authorization:`Bearer ${token}`,
          }}
          );
        
          console.log(response.data.data)
          let langArr=Object.keys(response.data.data)
            setLanguages(langArr);
        }
        fetchLanguage();
        
    }, []);

    const handleComplete = () => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      };
  
      useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior:"smooth"})
      },[answer])


      const updateQuestion=(question)=>{
        console.log("am question",question)
          dispatch(setInputVal(question));
      }

    return (
        <>
        <div className="chatbot-content">

          {circular !== 'visible' && (
  
    <NewChatHistory />
  
)}
{/* <NewChatHistory /> */}
        
        <div className="chatbox">
          <div className="header">
            <div className="header-logo">
        
              <img src="img/logo.png" alt="logo" /> Pilot
            </div>
          </div>
          <div className="chatbox-body">
            <div className="chat-content" ref={chatContainerRef}>
              <div className="status">
                {/* <h5 key={0}>03-Jan-2024</h5> */}
                <h5 key={0}>{getDate()}</h5>
              </div>
              <div>
                {clear && (
                  <div >
                    <div className="card">
                    Welcome to the Generative AI based HR Employee Assistant
                    Bot! ?? Got questions about company policies or HRMS
                    software ? I'm here to help with quick answers and guidance.
                    Just ask, and I'll handle the rest! Please provide concise
                    and clear queries to ensure the most precise results.
                  </div>
                  
                  <ShowLanguage languages={languages}/>
               
                </div>
                )}

                {answer.length > 0 &&
                  answer.map((item, index) => {
                    if (item.type === 'response') {

                     
                      //console.log('1st')
                      

                      return item.flag ? (
                        
                        <div className="card" key={index}>
                          
                          <div className="row">
                            <div className="col-md-8">
                              <p className="title">
                                {index === latestResponseIndex ? (
                                  <TypingEffect
                                    text={item.content}
                                    speed={5}
                                    onComplete={handleComplete}
                                  />
                                ) : typeof item.content === 'string' ? (
                                  <FormatTextWithBoldNumbersAndLinks text={item.content}/>
                                ) : (
                                  ''
                                )}
                              </p>
                            </div>
                            <div className="col-md-4">
                              {item.pdfPath.map((link, i) => {
                                // Extract the file name from the link
                                const fileName =
                                  typeof link === 'string'
                                    ? link.split('/').pop()
                                    : '';

                                return (
                                  <div key={i}>
                                    <a
                                      href={
                                        typeof link === 'string' ? link : '#'
                                      }
                                      className="anchor-link"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {fileName}
                                    </a>
                                  </div>
                                );
                              })}
                            </div>


                          </div>

 <div className="table-footer">                          
                          <div className="btn-wrapper">                          
                             

                              
                            <button
                              className="round-btn"
                              data-toggle="tooltip"
                              title="Unlike"
                              onClick={() => {
                               feedBack("unlike",item.feedback_id)
                              }}
                              style={{
                                backgroundColor:
                                  feedbackStatus[item.feedback_id] === "unlike"
                                    ? "#11a0f8"
                                    : "",
                                  color: feedbackStatus[item.feedback_id] === "unlike" ? "#fff" : "#000",
                              }}
                            >
                              <i className="fa fa-thumbs-down"></i>
                            </button>
                            <button
                              className="round-btn"
                              data-toggle="tooltip"
                              title="Like"
                              onClick={() => {
                                feedBack('like',item.feedback_id)
                              }}
                              style={{
                                backgroundColor:
                                  feedbackStatus[item.feedback_id] === "like"
                                    ? "#11a0f8"
                                    : "",
                                color: feedbackStatus[item.feedback_id] === "like" ? "#fff" : "#000",
                              }}
                            >
                              <i className="fa fa-thumbs-up"></i>
                            </button>
                          </div>


                          
                        </div>
                         <div ref={bottomRef} />
                        </div>
                      ) : (

                        
                        <div className="card" key={index}>
                          
                          <div className="row">
                            <div className="col-md-8">
                              <p className="title">
                                {index === latestResponseIndex ? (
                                  <TypingEffect
                                    text={item.content}
                                    speed={5}
                                    onComplete={handleComplete}
                                  />
                                ) : typeof item.content === 'string' ? (
                                  <FormatTextWithBoldNumbersAndLinks text={item.content}/>
                                ) : (
                                  ''
                                )}
                                {error&&
                              (<div>
                                 <ShowLanguage languages={languages}/>
                              </div>)
                              }
                              </p>
                             
                            </div>
                            <div className="col-md-4"></div>
                          </div>
                         
                         

                        </div>
                     
                        
                        
                        
                      );
                    
                      
                    
                    }
                    
                    
                    
                     else if (item.type === 'user') {
                      return (
                        <> 
                        <div key={index} className="question">
                          <div className="question-text">{item.content}</div>
                          <span className="edit">
                              <i
                                className="fa fa-edit text-blue-900 hover:text-blue-800 cursor-pointer"
                                style={{ fontSize: "1.2rem" }}
                                onClick={() => updateQuestion(item.content)}
                              ></i>

                          </span>
                          

                        </div>
                        {circular === 'visible' && answer.length-1===index && (             
                        <div className="d-flex justify-content-start w-100">
                        <div className="loadingDesign"><SkeletonCard /></div>
                        </div>
  
                         )}


                        </>

                        
                      );
                    }

                    return null;
                  })}
              </div>
            </div>
            
            <Input 
            handleInput={handleInput}
            mainChat={mainChat}
            /> 
            </div>
         </div>
        </div>
        {/* <Circular/> */}
       
        </>
    )

 }
 export default Homepage