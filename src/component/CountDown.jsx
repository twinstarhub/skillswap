import React, { useState, useEffect } from "react";
import getRemainingTimeUntilMsTimestamp from "./CountdownUtils";
import styled from "styled-components";

const defaultRemainingTime = {
  seconds: "00",
  minutes: "00",
  hours: "00",
  days: "00",
};
function CountDown({ timeStamp }) {
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemainingTime(timeStamp);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeStamp]);

  function updateRemainingTime(countdown) {
    setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown));
  }

  return (
    <Wrapper>
      <h3>
        <span>{remainingTime.days}</span> <span>days</span>
        {"  "}
        <span>{remainingTime.hours}</span> <span>hours</span>
        {"  "}
        <span>{remainingTime.minutes}</span> <span>minutes</span>
        {"  "}
        <span>{remainingTime.seconds}</span> <span>seconds</span>
      </h3>
    </Wrapper>
  );
}

export default CountDown;

const Wrapper = styled.div`
  h3 span {
    color: var(--primary);
  }
`;
