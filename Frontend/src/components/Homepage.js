import { setInputVal, addAnswer, setCircular, setClear, setError } from "../store/chatSlice";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShowLanguage from "./ShowLanguage.js";
import TypingEffect from "./TypingEffect.js";
import useFetch from "../service/FetchData.js";
import { getUrlParams } from "../service/getUrlParams.js";
import NewChatHistory from "./NewChatHistory.js";
import Circular from "./Circular.js";
import getDate from "../service/getDate.js";
import Input from "./Input.js";
import FormatTextWithBoldNumbersAndLinks from "./FormatTextWithBoldNumbersAndLinks.js";
import SkeletonCard from "./SkeletonCard.js";
import { ENDPOINTS } from "../service/endpoint.js";

function Homepage() {
  const [languages, setLanguages] = useState([]);
  const {
    inputVal,
    answer,
    latestResponseIndex,
    error,
    clear,
    circular,
    token,
  } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const chatContainerRef = useRef(null);
  const handleInput = (event) => {
    dispatch(setInputVal(event.target.value));
  };
  const { fetchData } = useFetch();

  const mainChat = async () => {
    try {
      dispatch(setClear(false));
      dispatch(addAnswer({ content: inputVal, type: "user" }));
      dispatch(setCircular("visible"));
      const resp = await fetchData(
        `${ENDPOINTS}/main_with_chat_history_input/v1`,
        inputVal
      );

      if (resp.data.Error) {
        dispatch(setError(true));
        dispatch(addAnswer({ content: resp.data.Error, type: "response" }));
      } else {
        dispatch(setError(false));
        dispatch(
          addAnswer({
            content: resp.data.Response,
            type: "response",
            flag: resp.data.flag,
            pdfPath: resp.data.pdf_path,
          })
        );
      }
      dispatch(setCircular("hidden"));
      dispatch(setInputVal(""));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUrlParams();
    async function fetchLanguage() {
      try {
        const response = await axios.post(
          `${ENDPOINTS}/show_languages`,
          { query: "Show all languages" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Extracting language names from the response data
        const languagesArray = Object.keys(response.data.data); // this gives an array of language names (e.g., ['igbo', 'dutch', 'lao'])
        setLanguages(languagesArray);
      } catch (err) {
        console.log("Error fetching languages:", err);
      }
    }
    fetchLanguage();
  }, [token]);

  const handleComplete = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <>
      <div className="chatbot-content">
        <NewChatHistory />
        <div className="chatbox">
          <div className="header">
            <div className="header-logo">
              <img src="img/logo.png" alt="logo" /> Pilot
            </div>
          </div>
          <div className="chatbox-body">
            <div className="chat-content" ref={chatContainerRef}>
              <div className="status">
                <h5 key={0}>{getDate()}</h5>
              </div>
              <div>
                {clear && (
                  <div>
                    <div className="card">
                      Welcome to the Generative AI based HR Employee Assistant
                      Bot! ?? Got questions about company policies or HRMS
                      software? I'm here to help with quick answers and guidance.
                      Just ask, and I'll handle the rest! Please provide concise
                      and clear queries to ensure the most precise results.
                    </div>

                    <ShowLanguage languages={languages} />
                  </div>
                )}

                {answer.length > 0 &&
                  answer.map((item, index) => {
                    if (item.type === "response") {
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
                                ) : typeof item.content === "string" ? (
                                  <FormatTextWithBoldNumbersAndLinks
                                    text={item.content}
                                  />
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                            <div className="col-md-4">
                              {item.pdfPath.map((link, i) => {
                                const fileName =
                                  typeof link === "string"
                                    ? link.split("/").pop()
                                    : "";
                                return (
                                  <div key={i}>
                                    <a
                                      href={typeof link === "string" ? link : "#"}
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
                                ) : typeof item.content === "string" ? (
                                  <FormatTextWithBoldNumbersAndLinks
                                    text={item.content}
                                  />
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                            <div className="col-md-4"></div>
                          </div>
                        </div>
                      );
                    } else if (item.type === "user") {
                      return (
                        <>
                          <div key={index} className="question">
                            <div className="question-text">{item.content}</div>
                          </div>
                          {circular === "visible" && answer.length - 1 === index && (
                            <div className="d-flex justify-content-start w-100">
                              <div className="loadingDesign">
                                <SkeletonCard />
                              </div>
                            </div>
                          )}
                        </>
                      );
                    }

                    return null;
                  })}
              </div>
            </div>
            <Input handleInput={handleInput} mainChat={mainChat} />
            {/* Render ShowLanguage when there is an error */}
            {error && (
              <div>
                <ShowLanguage languages={languages} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;
