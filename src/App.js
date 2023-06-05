import React, { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [sessionLength, setSessionLength] = useState(1500);
  const [breakLength, setBreakLength] = useState(300);
  const [clockBreakLength, setClockBreakLength] = useState(breakLength);
  const [clockSessionLength, setClockSessionLength] = useState(sessionLength);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [started, setStarted] = useState(false);
  var timerSessionInterval = useRef(null);
  var timerBreakInterval = useRef(null);
  const audioObj = useRef(null);

  useEffect(() => {
    setClockSessionLength(sessionLength);
    setClockBreakLength(breakLength);
  }, [sessionLength, breakLength]);

  useEffect(() => {
    if (clockSessionLength === -1) {
      setIsSessionFinished(true);
      clearInterval(timerSessionInterval.current);
      setClockSessionLength(sessionLength);
      audioObj.current.play();
      startBreak();
    }
    if (clockBreakLength === -1) {
      setIsSessionFinished(false);
      clearInterval(timerBreakInterval.current);
      setClockBreakLength(breakLength);
      audioObj.current.play();
      startSession();
    }
  }, [clockSessionLength, clockBreakLength]);

  const handleClickDecrement = (setLength, length) => {
    if (length / 60 > 1) {
      setLength((e) => {
        if (e < 0) {
          handleReset()
        }
        return e - 60;
      });
    }
  };

  const handleClickIncrement = (setLength, length) => {
    if (length / 60 < 60) {
      setLength((e) => {
        return e + 60;
      });
    }
  };

  const handleReset = () => {
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    setBreakLength(60 * 5);
    setSessionLength(60 * 25);
    setClockBreakLength(breakLength);
    setClockSessionLength(sessionLength);
    clearInterval(timerBreakInterval.current);
    clearInterval(timerSessionInterval.current);
    setIsSessionFinished(false);
    setStarted(false);
  };

  const startBreak = () => {
    timerBreakInterval.current = setInterval(() => {
      if (clockBreakLength !== -1) {
        setClockBreakLength((e) => e - 1);
      }
    }, 1000);
  };

  const startSession = () => {
    timerSessionInterval.current = setInterval(() => {
      if (clockSessionLength !== -1) {
        setClockSessionLength((e) => e - 1);
      }
    }, 1000);
  };

  const handleStartStop = () => {
    if (started) {
      clearInterval(timerBreakInterval.current);
      clearInterval(timerSessionInterval.current);
      setStarted(false);
    } else {
      setStarted(true);
      if (!isSessionFinished) {
        timerSessionInterval.current = setInterval(() => {
          if (clockSessionLength > -1) {
            setClockSessionLength((e) => e - 1);
          }
        }, 1000);
      } else {
        timerBreakInterval.current = setInterval(() => {
          if (clockBreakLength > -1) {
            setClockBreakLength((e) => e - 1);
          }
        }, 1000);
      }
    }
  };

  return (
    <div className="App">
      <div className="main-wrapper">
        <div className="timer-wrapper">
          <div className="title">25 + 5 Clock</div>
          <div className="labels">
            <div id="break-label" className="label">
              <div className="break-title label-title">Break Length</div>
              <div className="break-body part-body">
                <button
                  id="break-decrement"
                  className="decrement"
                  onClick={() =>
                    handleClickDecrement(setBreakLength, breakLength)
                  }
                >
                  <i className="ph-bold ph-arrow-down"></i>
                </button>
                <div id="break-length" className="length">
                  {breakLength / 60}
                </div>
                <button
                  id="break-increment"
                  className="increment"
                  onClick={() =>
                    handleClickIncrement(setBreakLength, breakLength)
                  }
                >
                  <i className="ph-bold ph-arrow-up"></i>
                </button>
              </div>
            </div>
            <div id="session-label" className="label">
              <div className="session-title label-title">Session Length</div>
              <div className="session-title"></div>
              <div className="session-body part-body">
                <button
                  id="session-decrement"
                  className="decrement"
                  onClick={() =>
                    handleClickDecrement(setSessionLength, sessionLength)
                  }
                >
                  <i className="ph-bold ph-arrow-down"></i>
                </button>
                <div id="session-length" className="length">
                  {sessionLength / 60}
                </div>
                <button
                  id="session-increment"
                  className="increment"
                  onClick={() =>
                    handleClickIncrement(setSessionLength, sessionLength)
                  }
                >
                  <i className="ph-bold ph-arrow-up"></i>
                </button>
              </div>
            </div>
          </div>
          <div id="timer-label">
            <div id="timer-title">
              {isSessionFinished ? "Break" : "Session"}
            </div>
            <div id="time-left">
              {!isSessionFinished
                ? Math.floor(clockSessionLength / 60) < 10
                  ? "0" + String(Math.floor(clockSessionLength / 60))
                  : Math.floor(clockSessionLength / 60)
                : Math.floor(clockBreakLength / 60) < 10
                ? "0" + String(Math.floor(clockBreakLength / 60))
                : Math.floor(clockBreakLength / 60)}
              :
              {(
                !isSessionFinished
                  ? clockSessionLength % 60 < 10
                  : clockBreakLength % 60 < 10
              )
                ? "0" +
                  String(
                    (!isSessionFinished
                      ? clockSessionLength
                      : clockBreakLength) % 60
                  )
                : String(
                    (!isSessionFinished
                      ? clockSessionLength
                      : clockBreakLength) % 60
                  )}
            </div>
            <div>
              {!false
                ? Math.floor(clockSessionLength / 60) < 10
                  ? "0" + String(Math.floor(clockSessionLength / 60))
                  : Math.floor(clockSessionLength / 60)
                : Math.floor(clockBreakLength / 60) < 10
                ? "0" + String(Math.floor(clockBreakLength / 60))
                : Math.floor(clockBreakLength / 60)}
              :
              {clockSessionLength % 60 < 10
                ? "0" + String(clockSessionLength % 60)
                : String(clockSessionLength % 60)}
            </div>
          </div>
          <div id="video-controls">
            <button onClick={handleStartStop} id="start_stop">
              <i className="ph-fill ph-play-pause"></i>
            </button>
            <button onClick={handleReset} id="reset">
              <i className="ph-fill ph-repeat"></i>
            </button>
          </div>
        </div>
        <div className="author">
          <div className="desc">Designed and Coded by</div>
          <div className="main-author">
            <a href="https://codepen.io/acaemr22">Emre Açar</a>
          </div>
        </div>
        <audio id="beep" ref={audioObj}>
          <source
            src="https://www.pacdv.com/sounds/interface_sound_effects/sound10.mp3"
            type="audio/mpeg"
          />
        </audio>
      </div>
    </div>
  );
}

export default App;
