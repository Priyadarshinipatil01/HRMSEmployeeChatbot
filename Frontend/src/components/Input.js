import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './Homepage.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';

import { setInputVal } from "../store/chatSlice";

const Input = ({ handleInput, mainChat }) => {
  const { inputVal } = useSelector((state) => state.chat);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current.focus();
       // dispatch(setInputVal(e.value)); 
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, inputVal]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("am transcript",transcript)
      dispatch(setInputVal(transcript));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, [dispatch]);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (!listening) {
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <div className="typer">
      <textarea
        ref={inputRef}
        className="form-control"
        placeholder="Enter your prompt here"
        id="analyticsTxtbox"
        autoComplete="off"
        value={inputVal}
        onChange={handleInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            mainChat();
            e.target.blur();
          }
        }}
      ></textarea>

      <div className="btn-send">
        <button
          className={`circle-button ${listening ? "bg-danger" : "danger-bg"}`}
          onClick={handleMicClick}
        >
          <i className="fa fa-microphone"></i>
        </button>

        <button className="circle-button success-bg" onClick={mainChat}>
          <i className="fa fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default Input;
