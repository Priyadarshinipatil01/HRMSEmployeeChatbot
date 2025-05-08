import FormatTextWithBoldNumbersAndLinks from './FormatTextWithBoldNumbersAndLinks';
import React, { useState, useEffect } from 'react';

function TypingEffect({ text, speed, onComplete }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
     < FormatTextWithBoldNumbersAndLinks text={displayText}/>
  );
}

export default TypingEffect;
