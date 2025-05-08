import { useState } from "react";
import  "./Homepage.css";

function ShowLanguage({languages}){
    const [isOpen,setIsOpen]=useState(false);
    const toggleDropDown=(()=>{
        setIsOpen(!isOpen)
    })
    return(
        <div>
        <button id="langButton"
          onClick={toggleDropDown} 
        >
          Click here to check languages
        </button>
        {isOpen && (
          <div>
            <ul >
              {languages.map((language, i) => (
                <li
                  key={i}
                >
                  {language}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  export default ShowLanguage;
