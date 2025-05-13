import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, doc, getDoc, getDocs, updateDoc, setDoc } from "firebase/firestore";

const DSAQuestions = ({ selectedKeyword }) => {
  const [questions, setQuestions] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userAnswer, setUserAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [leaderboard, setLeaderboard] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const displayName = user?.displayName || "Guest";

  useEffect(() => {
    if (userId) {
      fetchUserProgress();
      fetchQuestions();
      fetchLeaderboard();
    }
  }, [userId, selectedKeyword]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const fetchUserProgress = async () => {
    const userRef = doc(db, "user_progress", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setCurrentLevel(userSnap.data().currentLevel);
    } else {
      await setDoc(userRef, { currentLevel: 1, displayName });
      setCurrentLevel(1);
    }
  };

  const fetchQuestions = async () => {
    const questionsRef = collection(db, "dsa_questions");
    const questionsSnap = await getDocs(questionsRef);
    const sortedQuestions = questionsSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => a.level - b.level);
    setQuestions(sortedQuestions);
  };

  const fetchLeaderboard = async () => {
    const leaderboardRef = collection(db, "user_progress");
    const leaderboardSnap = await getDocs(leaderboardRef);
    const leaderboardData = leaderboardSnap.docs
      .map(doc => doc.data())
      .sort((a, b) => b.currentLevel - a.currentLevel);
    setLeaderboard(leaderboardData);
  };

  const handleSubmit = async () => {
    if (timeLeft === 0) {
      setFeedback("⏳ Time is up! Try again.");
      setTimeout(() => setFeedback(null), 2000); // Keep feedback visible for 2 seconds
      return;
    }
  
    const currentQuestion = questions.find(q => q.level === currentLevel);
    if (!currentQuestion) {
      setFeedback("❌ No question found for this level.");
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
  
    if (userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer?.toLowerCase()) {
      setFeedback("✅ Correct! Moving to the next level.");
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setTimeLeft(30);
        setFeedback(null);
      }, 1000);
      await updateDoc(doc(db, "user_progress", userId), { currentLevel: currentLevel + 1 });
      fetchLeaderboard();
    } else {
      setFeedback("❌ Incorrect! Try again.");
      setTimeout(() => setFeedback(null), 1000); // Keep feedback visible for 2 seconds
    }
  };
  

  return (
    <div className="flex h-auto p-5 bg-gray-100">
      <div className="w-3/4 p-5">
        <h2 className="text-3xl font-bold mb-5">DSA Quizs: {selectedKeyword}</h2>
        {questions.length > 0 && currentLevel <= 50 ? (
  <div className="p-6 bg-white rounded shadow-md">
    <h3 className="text-lg font-semibold">Level {currentLevel} ⏳ {timeLeft}s</h3>
    <p className="mb-3">{questions[currentLevel - 1]?.question}</p>

    {/* Render options if available */}
    {questions[currentLevel - 1]?.options?.length > 0 ? (
      <div className="mb-3">
        {questions[currentLevel - 1].options.map((option, index) => (
          <button
            key={index}
            className={`block w-full p-2 mt-2 border rounded ${
              userAnswer === option ? "bg-green-300" : "bg-gray-200"
            }`}
            onClick={() => setUserAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    ) : (
      <input
        type="text"
        placeholder="Enter answer..."
        className="border p-2 rounded w-full"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />
    )}

    <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded" onClick={handleSubmit}>
      Submit Answer
    </button>
    <button className="mt-3 ml-3 px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setHint(questions[currentLevel - 1]?.hint)}>
      Show Hint
    </button>
    {hint && <p className="mt-2 text-sm text-gray-600">Hint: {hint}</p>}
  </div>
) : (
  <p className="text-xl">🎉 You have completed all levels!</p>
)}

        {timeLeft === 0 && (
          <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded" onClick={() => setTimeLeft(30)}>
            Restart Timer
          </button>
        )}
      </div>
      <div className="w-1/4 p-5">
        <h2 className="text-xl font-bold">🏆 Leaderboard</h2>
        <ul className="mt-3">
          {leaderboard.map((user, index) => (
            <li key={index} className="mt-2 p-2 bg-gray-200 rounded shadow">
              {index + 1}. {user.displayName} - Level {user.currentLevel}
            </li>
          ))}
        </ul>
      </div>
      {feedback && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 p-5 bg-white shadow-lg rounded">
          <p className="text-lg">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default DSAQuestions;