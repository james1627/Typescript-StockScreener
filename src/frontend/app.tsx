//App.tsx

import React, { useState, useEffect } from 'react';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const questions: Question[] = [
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Lisbon'],
    answer: 'Paris',
  },
  {
    question: 'Which language is used for web development?',
    options: ['Python', 'Java', 'C++', 'JavaScript'],
    answer: 'JavaScript',
  },
  {
    question: 'Who developed the theory of relativity?',
    options: ['Newton', 'Einstein', 'Galileo', 'Tesla'],
    answer: 'Einstein',
  },
];

const QuizApp: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(10);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (option: string) => {
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(10);
    } else {
      setShowResult(true);
    }
  };

  // Inline Style Objects
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #6b46c1, #4c51bf)',
      padding: '20px',
      color: 'white',
    },
    quizBox: {
      background: 'white',
      color: '#333',
      padding: '20px',
      borderRadius: '20px',
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
      width: '400px',
      textAlign: 'center' as const,
    },
    questionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#4c51bf',
      marginBottom: '15px',
    },
    timer: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: 'red',
      marginBottom: '15px',
    },
    optionsContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '10px',
    },
    optionButton: {
      padding: '12px 16px',
      fontSize: '1rem',
      background: '#4c51bf',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: '0.3s',
    },
    optionButtonHover: {
      background: '#3730a3',
    },
    resultContainer: {
      textAlign: 'center' as const,
    },
    restartButton: {
      marginTop: '20px',
      padding: '12px 16px',
      fontSize: '1rem',
      background: '#4c51bf',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: '0.3s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.quizBox}>
        {showResult ? (
          <div style={styles.resultContainer}>
            <h2 style={styles.questionTitle}>Quiz Completed!</h2>
            <p className="text-xl mt-2">
              Your Score: {score} / {questions.length}
            </p>
            <button
              style={styles.restartButton}
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setShowResult(false);
                setTimeLeft(10);
              }}
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2 style={styles.questionTitle}>
              {questions[currentQuestion].question}
            </h2>
            <p style={styles.timer}>Time Left: {timeLeft}s</p>
            <div style={styles.optionsContainer}>
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  style={styles.optionButton}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      styles.optionButtonHover.background)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      styles.optionButton.background)
                  }
                  onClick={() => handleAnswer(option)}
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
};

export default QuizApp;
