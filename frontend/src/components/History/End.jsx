/* eslint-disable */
import React, { useEffect, useState } from "react";

// import { formatTime } from "../../History-page/utils";

const End = ({ results, data, onReset, onAnswersCheck, time, resetQuiz }) => {
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    let correct = 0;
    results.forEach((result, index) => {
      if (result.a === data[index].answer) {
        correct++;
      }
    });
    setCorrectAnswers(correct);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="card">
      <div className="card-content">
        <div className="content">
          <h3>Your results</h3>
          <p>
            {correctAnswers} of {data.length}
          </p>
          <p>
            <strong>{Math.floor((correctAnswers / data.length) * 100)}%</strong>
          </p>
          {/* <p>
            <strong>Your time:</strong> {formatTime(time)}
          </p> */}
          <div className="fullButton">
            <button
              className="button is-info mr-2"
              type="button"
              onClick={onAnswersCheck}
            >
              Check your answers
            </button>
            <button
              className="button is-success"
              type="button"
              onClick={onReset}
            >
              Try again
            </button>
            <button className="button" type="button" onClick={resetQuiz}>
              Reset Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default End;