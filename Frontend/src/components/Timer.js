import React, { useState, useEffect } from 'react';

const Timer = ({ resetTimer }) => {
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerReset, setTimerReset] = useState(false);

  useEffect(() => {
    let timer;

    if (resetTimer === "visible" && timeLeft === 0) {
      setTimeLeft(20);
      setTimerReset(true);
    } else {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [resetTimer, timeLeft]);

  useEffect(() => {
    if (!resetTimer) {
      setTimerReset(false);
    }
  }, [resetTimer]);

  return (
    <div className='timer-wrapper'>
      {timeLeft > 0 ? (
        <div>
          {timerReset ? "Be patience, generating..." : "Please wait..."} {timeLeft} seconds
        </div>
      ) : (
        <div>
          Time's up!
        </div>
      )}
    </div>
  );
};

export default Timer;
