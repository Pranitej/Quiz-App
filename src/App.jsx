import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: "Paris",
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: "JavaScript",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Central Style Sheets",
      "Cascading Style Sheets",
      "Cascading Simple Sheets",
      "Cars SUVs Sailboats",
    ],
    answer: "Cascading Style Sheets",
  },
  {
    question: "What year was JavaScript launched?",
    options: ["1996", "1995", "1994", "None of the above"],
    answer: "1995",
  },
];
function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [timer, setTimer] = useState(15); // ⏳ new: 15 seconds timer

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  // ⏱️ Countdown timer logic
  useEffect(() => {
    if (showScore) return; // no timer if quiz finished

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          handleNoAnswer(); // if timer hits 0, treat as no answer
          return 15; // reset for next question
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [currentQuestion, showScore]);

  const handleNoAnswer = () => {
    setUserAnswers([
      ...userAnswers,
      { selected: "No Answer", correct: questions[currentQuestion].answer },
    ]);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimer(15); // reset timer for next question
    } else {
      setShowScore(true);
    }
  };

  const handleAnswerOptionClick = (option) => {
    const isCorrect = option === questions[currentQuestion].answer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setUserAnswers([
      ...userAnswers,
      { selected: option, correct: questions[currentQuestion].answer },
    ]);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimer(15); // reset timer for next question
    } else {
      setShowScore(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
    setShowScore(false);
    setTimer(15);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-all bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          {showScore ? (
            <h1 className="text-3xl font-bold mb-4">Your Score 🎯</h1>
          ) : (
            <h2 className="text-2xl font-semibold mb-4">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
          )}
          <button
            onClick={toggleTheme}
            className="flex items-center cursor-pointer gap-2 mb-4 p-2 px-4 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-all"
          >
            {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
          </button>
        </div>

        {!showScore && (
          <div className="text-center mb-4">
            <p className="text-lg font-medium">⏳ Time Left: {timer}s</p>
          </div>
        )}

        {showScore ? (
          <div className="text-center">
            <p className="text-xl mb-6">
              {score} / {questions.length}
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              Review Your Answers 📚
            </h2>
            <div className="flex flex-col gap-6 text-left">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700"
                >
                  <h3 className="font-semibold mb-2">
                    {idx + 1}. {q.question}
                  </h3>
                  <p>
                    <span className="font-medium">Your Answer:</span>{" "}
                    <span
                      className={
                        userAnswers[idx].selected === q.answer
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {userAnswers[idx].selected}
                    </span>
                  </p>
                  {userAnswers[idx].selected !== q.answer && (
                    <p>
                      <span className="font-medium">Correct Answer:</span>{" "}
                      <span className="text-green-500">{q.answer}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleRestart}
              className="mt-8 bg-indigo-500 cursor-pointer text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-all"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-medium mb-6">
              {questions[currentQuestion].question}
            </h3>
            <div className="flex flex-col gap-4">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerOptionClick(option)}
                  className="bg-purple-500 cursor-pointer hover:bg-purple-600 text-white py-2 px-4 rounded-full transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
