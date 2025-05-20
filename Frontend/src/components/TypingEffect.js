import FormatTextWithBoldNumbersAndLinks from './FormatTextWithBoldNumbersAndLinks';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
function TypingEffect({ text, speed, onComplete }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  //  const{
     
  //       answer
          
  //   }=useSelector((state)=>state.chat)
  const bottomRef=useRef(null);
  useEffect(() => {
    let interval;
    if (currentIndex < text?.length) {
      interval = setInterval(() => {
        setDisplayText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, speed);
    } else {
      onComplete();
    }

    return () => clearInterval(interval);
  }, [text, speed, currentIndex, onComplete]);

  useEffect(()=>{
 bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  },[displayText])

  return (
    <>

     < FormatTextWithBoldNumbersAndLinks text={displayText}
     />
   <div ref={bottomRef} />
    </>
    
  );
}

export default TypingEffect;
