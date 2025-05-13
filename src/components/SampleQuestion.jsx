import { db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const addQuestions = async () => {
  const questions = [
    {
      level: 1,
      keyword: "Binary Search",
      question: "What is the time complexity of Binary Search?",
      correctAnswer: "O(log n)",
      options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
      hint: "Think about how the array is divided in each step.",
    },
    {
      level: 2,
      keyword: "Recursion",
      question: "Which algorithm is based on the divide-and-conquer approach?",
      correctAnswer: "Merge Sort",
      options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Selection Sort"],
      hint: "This algorithm divides the array and merges back in sorted order.",
    },
  ];

  try {
    const questionsRef = collection(db, "dsa_questions");
    for (let q of questions) {
      await setDoc(doc(questionsRef, q.level.toString()), q);
    }
    console.log("Questions added successfully!");
  } catch (error) {
    console.error("Error adding questions: ", error);
  }
};

// Call the function once (Remove after execution)
addQuestions();
