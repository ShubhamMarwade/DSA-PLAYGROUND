import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, doc, getDoc, getDocs, updateDoc, setDoc } from "firebase/firestore";

const DSAKeywords = ({ selectedKeyword }) => {
  const [questions, setQuestions] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userAnswers, setUserAnswers] = useState({});
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
    const userRef = doc(db, "user_progress1", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setCurrentLevel(userSnap.data().currentLevel);
    } else {
      await setDoc(userRef, { currentLevel: 1, displayName });
      setCurrentLevel(1);
    }
  };

  const fetchQuestions = async () => {
    const questionsRef = collection(db, "dsa_keywords");
    const questionsSnap = await getDocs(questionsRef);
    const sortedQuestions = questionsSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => a.level - b.level);
    setQuestions(sortedQuestions);
  };

  const fetchLeaderboard = async () => {
    const leaderboardRef = collection(db, "user_progress1");
    const leaderboardSnap = await getDocs(leaderboardRef);
    const leaderboardData = leaderboardSnap.docs
      .map(doc => doc.data())
      .sort((a, b) => b.currentLevel - a.currentLevel);
    setLeaderboard(leaderboardData);
  };

  const handleInputChange = (index, value) => {
    setUserAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async () => {
    if (timeLeft === 0) {
      setFeedback("⏳ Time is up! Try again.");
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    const currentQuestion = questions.find(q => q.level === currentLevel);
    if (!currentQuestion) {
      setFeedback("❌ No question found for this level.");
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    const correctAnswers = currentQuestion.correctAnswers || [];
    const userResponses = Object.values(userAnswers);

    if (
      correctAnswers.length === userResponses.length &&
      correctAnswers.every((word, idx) => word.toLowerCase() === userResponses[idx].trim().toLowerCase())
    ) {
      setFeedback("✅ Correct! Moving to the next level.");
      setTimeout(async () => {
        setCurrentLevel(prev => prev + 1);
        setTimeLeft(30);
        setUserAnswers({});
        setFeedback(null);
        await updateDoc(doc(db, "user_progress1", userId), { currentLevel: currentLevel + 1 });
        fetchLeaderboard();
      }, 1000);
    } else {
      setFeedback("❌ Incorrect! Try again.");
      setTimeout(() => setFeedback(null), 1000);
    }
  };


  return (
    <div className="flex h-auto p-5 bg-gray-100">
      <div className="w-3/4 p-5">
        <h2 className="text-3xl font-bold mb-5">DSA Keywords: {selectedKeyword}</h2>
        {questions.length > 0 && currentLevel <= 50 ? (
          <div className="p-6 bg-white rounded shadow-md">
            <h3 className="text-lg font-semibold">Level {currentLevel} ⏳ {timeLeft}s</h3>
            <p className="mb-3">Fill in the missing keywords:</p>

            <pre className="p-3 bg-gray-200 rounded text-sm font-mono">
              {questions[currentLevel - 1]?.question.split("____").map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < (questions[currentLevel - 1]?.correctAnswers.length || 0) && (
                    <input
                      type="text"
                      className="border-b border-gray-500 focus:border-blue-500 w-20 text-center mx-1"
                      value={userAnswers[index] || ""}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  )}
                </React.Fragment>
              ))}
            </pre>

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

export default DSAKeywords;
