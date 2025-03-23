import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 10,
    minutes: 24,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
          } else if (days > 0) {
            days--;
            hours = 23;
            minutes = 59;
            seconds = 59;
          } else {
            clearInterval(timer);
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-2 text-white rounded-xl shadow-md p-4 max-w-[240px] bg-gray-200 bg-opacity-30 backdrop-filter backdrop-blur-lg">
        <h1 className=" text-l text-center">Winter Countdown</h1>
        <div className="grid grid-flow-col gap-2 text-center text-sm auto-cols-max">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="flex flex-col items-center pt-2 pb-4 bg-neutral rounded-box text-neutral-content text-xs">
              <span className="countdown text-base rounded-sm bg-foreground ">
                <span className="text-black p-2" style={{ "--value": value } as React.CSSProperties}>{value}</span>
              </span>
              {label}
            </div>
          ))}
        </div>
    </div>
    );
};

export default CountdownTimer;