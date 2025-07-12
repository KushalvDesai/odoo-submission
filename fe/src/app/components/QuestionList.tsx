import React from "react";
import QuestionCard from "./QuestionCard";

const questions = [
  {
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description:
      "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine ...",
    tags: ["SQL", "Join", "Beginner"],
    user: "User Name",
    answers: 5,
  },
  {
    title: "Question......",
    description: "Descriptions....",
    tags: ["Tag1", "Tag2"],
    user: "User Name",
    answers: 3,
  },
  {
    title: "Question......",
    description: "Descriptions....",
    tags: ["Tag1", "Tag2"],
    user: "User Name",
    answers: 2,
  },
];

const QuestionList = () => {
  return (
    <div className="w-full flex flex-col gap-2 mt-6">
      {questions.map((q, idx) => (
        <QuestionCard key={idx} {...q} />
      ))}
    </div>
  );
};

export default QuestionList; 