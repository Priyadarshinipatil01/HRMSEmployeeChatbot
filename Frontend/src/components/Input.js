import React from "react";
import { useSelector } from "react-redux";
import './Homepage.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';

const Input = ({ handleInput, mainChat }) => {
    const{
    inputVal,  
    }=useSelector((state)=>state.chat)
    return (
    <div className="typer">
      <textarea
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
        <button className="circle-button danger-bg">
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
