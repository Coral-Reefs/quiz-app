"use client";
import { Button, Container, Grid, GridItem } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Quiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState();
  const [questionNo, setQuestionNo] = useState(0);
  const [answers, setAnswers] = useState([]);

  const router = useRouter();
  useEffect(() => {
    fetch("/quizzes.json")
      .then((response) => response.json())
      .then((data) => setQuiz(data[quizId]))
      .catch((error) => console.error("Error fetching quizzes:", error));
  }, []);

  const onSubmit = (e) => {
    const newAnswer = e.target.value;

    setAnswers((currentAnswers) => [...currentAnswers, newAnswer]);

    if (questionNo === quiz.questions.length - 1) {
      const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
      const id = Date.now();
      attempts.push({ id, quizId, answers: [...answers, newAnswer] }); // Add newAnswer
      localStorage.setItem("attempts", JSON.stringify(attempts));

      setTimeout(() => {
        router.replace(`/quiz/summary/${id}`);
      }, 0);
    } else {
      setQuestionNo((prev) => prev + 1);
    }
  };
  console.log(answers);

  if (!quiz) return "Loading...";
  const question = quiz.questions[questionNo];
  return (
    <Container
      px={20}
      centerContent={true}
      gap={10}
      className="h-screen flex flex-col"
    >
      <div className="flex-1 flex items-center text-xl">
        {question.question}
      </div>
      <div className="flex-1 w-full">
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap="5"
          className="h-full"
        >
          {question.options.map((option, i) => (
            <GridItem className="h-full" key={i}>
              <Button
                type="button"
                isDisabled={questionNo === quiz.questions.length - 1}
                onClick={onSubmit}
                value={option}
                className="h-5/6 w-full items-center justify-center overflow-hidden rounded-xl border border-[#6f459b] bg-[#935dcc] hover:bg-[#a16fd6] transition-all duration-300 [box-shadow:0px_8px_1px_#6f459b] active:translate-y-[8px] active:shadow-none text-white text-xl"
              >
                {option}
              </Button>
            </GridItem>
          ))}
        </Grid>
      </div>
    </Container>
  );
};

export default Quiz;
