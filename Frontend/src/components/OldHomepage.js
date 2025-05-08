import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import './Homepage.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import TypingEffect from './TypingEffect';

import Timer from './Timer';
import ShowLanguage from './ShowLanguage';

function Homepage() {
  const [clear, setClear] = useState(true);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState([]);
  const [userName, setUserName] = useState('');
  
  const [chatHistory, setChatHistory] = useState([]);
  const [latestResponseIndex, setLatestResponseIndex] = useState(null);

  const [circular, setCircular] = useState('hidden');

  const chatContainerRef = useRef(null);

  const [baseURL, setBaseURL] = useState('');
  const [customerID, setCustomerID] = useState('');
  const [languages,setLanguages]=useState([]);
  const [error,setError]=useState(false);
 

  console.log('baseURL::', baseURL);
  console.log('customerID::', customerID);
  console.log('UserName ::', userName);

  const url = 'https://shrmempassistant.shrmpro.com';

  const handleChangeQuestion = (event) => {
   
    const word = event.target.value;
    setQuestion(word);
    console.log(word);
  };

  const doc = async (e) => {
    console.log(e, 'eeeeeee');
    try {
      setAnswer((prevResults) => [
        ...prevResults,
        { content: question, type: 'user' },
      ]);
      // setRespCheck(false);
      setQuestion('');
      setCircular('visible');
      setClear(false);
      const resp = await axios.post(`${url}/main_with_chat_history_input`, {
        //query: question.trim(),
        query: question,
        baseurl: baseURL || 'https://sphinx.shrmpro.com',
        num_results: 1,
        company_id: customerID || 1,
        chat_history: chatHistory,
        username: userName || 'Administrator',
      });
      console.log(resp.data, 'resp');
      if (resp.data.Error) {
        console.log("am error")
        setError(true);
        setAnswer((prevResults) => {
          const updatedResults = [
            ...prevResults,
           

            { content: resp.data.Error, type: 'response' },
          ];
          setLatestResponseIndex(updatedResults.length - 1);
          return updatedResults;
        });
      } else {
        setError(false);
        setAnswer((prevResults) => {
          const updatedResults = [
            ...prevResults,
            {
              content: resp.data.Response,
              type: 'response',
              flag: resp.data.Flag,
              pdfPath: resp.data.pdf_path,
            },
          ];
          setLatestResponseIndex(updatedResults.length - 1);
          return updatedResults;
        });
        setChatHistory(resp.data.chat_history);
      }
      setCircular('hidden');
    } catch (error) {
      console.log(error);
    }
  };

  const handleComplete = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const formatTextWithBoldNumbersAndLinks = (text) => {
    return text.split('\n').map((line, index) => {
      const parts = line.split(/\b(\d+|\bhttps?:\/\/[^\s]+)\b/);
      return (
        <React.Fragment key={index}>
          {parts.map((part, partIndex) => {
            const isNumber = /^\d+$/.test(part.trim());
            const isLink = /^https?:\/\/[^\s]+$/.test(part.trim());

            if (isNumber) {
              return <strong key={partIndex}>{part}</strong>;
            } else if (isLink) {
              // const fileName = part.split('/').pop(); // Extract the filename from the link
              return (
                <a
                  key={partIndex}
                  href={part}
                  className="anchor-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {part}
                </a>
              );
            } else {
              return part;
            }
          })}
          <br />
        </React.Fragment>
      );
    });
  };

  const handleClear = () => {
    setAnswer([]);
    setClear(true);
  };


  useEffect(()=>{
    async function fetchLanguage(){
    const response=await axios.post(`http://164.52.205.159:8012/show_languages`, {
      //query: question.trim(),
      query: "Show all languages",
      baseurl: baseURL || 'https://sphinx.shrmpro.com',
      company_id: customerID || 1,
      chat_history: chatHistory,
      username: userName || 'Administrator',
    });

    setLanguages(response.data);
   // console.log("am language",response.data)
  }
    fetchLanguage();
  },[])

  useEffect(() => {
    const url = new URL(window.location.href);
    const iframeSrc=url.pathname;
          const baseURLMatch = iframeSrc.match(/baseURL=([^&]+)/); // Matches baseURL value
      const customerIDMatch = iframeSrc.match(/customerID=([^&]+)/); // Matches customerID value
      const userNameMatch = iframeSrc.match(/UserName=([^&]+)/); // Matches UserName value

      // Extract the values or set them to null if not found
      setBaseURL(baseURLMatch ? baseURLMatch[1] : null);
      setCustomerID(customerIDMatch ? customerIDMatch[1] : null);
      setUserName(userNameMatch ? userNameMatch[1] : null);
  }, []);

  function getDate() {
    const today = new Date();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const date = String(today.getDate()).padStart(2, '0');
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    return `${date}-${month}-${year}`;
  }




  return (
    <>
      <div className="chatbot-content">
        <div className="sidebar">
          <div className="chats">
            <button className="btn btn-primary" onClick={handleClear}>
              <i className="fa fa-plus-circle"></i> New Chat
            </button>
          </div>
        
          <div className="profile">
            <button className="tab" data-call="upgrade">
              Upgrade to Premium
            </button>
            <button className="tab">hr@sphinxworldbiz.com</button>
          </div>
        </div>

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
                              <p className="title-text">
                                Please follow below steps to answer your query:
                              </p>
                            </div>
                            <div className="col-md-4">
                              <p className="title-text">Reference Link</p>
                            </div>
                          </div>

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
                                  formatTextWithBoldNumbersAndLinks(
                                    item.content,
                                  )
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
                        </div>
                      ) : (
                        <div className="card" key={index}>
                          <div className="row">
                            <div className="col-md-8">
                              <p className="title-text">
                                Please follow below steps to answer your query:
                              </p>
                              
                            </div>
                          </div>

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
                                  formatTextWithBoldNumbersAndLinks(
                                    item.content,
                                  )
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
                    } else if (item.type === 'user') {
                      console.log('2st');
                      return (
                        <div key={index} className="question">
                          <span className="question-text">{item.content}</span>
                        </div>
                      );
                    }

                    return null;
                  })}
              </div>
            </div>
            <div className="typer">
              <textarea
                className="form-control"
                placeholder="Enter your prompt here"
                id="analyticsTxtbox"
                autoComplete="off"
                value={question}
                onChange={handleChangeQuestion}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    doc();
                    e.target.blur();
                  }
                }}
              ></textarea>

              <div className="btn-send">
                <button className="circle-button danger-bg">
                  <i className="fa fa-microphone"></i>
                </button>
                <button className="circle-button success-bg">
                  <i className="fa fa-paper-plane" onClick={doc}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {circular === 'visible' && (
        <div className="loader-bg">
          <div className="loader-box">
            <div className="loader"></div>
            <img src="../img/company.png" alt="logo" />
            <div className="loader-txt">Loading</div>
            <div className="timer-txt">
              {' '}
              <Timer resetTimer={circular} />{' '}
            </div>
          </div>
        </div>
      )}

   
    </>
  );
}

export default Homepage;
