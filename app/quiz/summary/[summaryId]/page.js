"use client";
import {
  Button,
  Container,
  Card,
  Badge,
  Heading,
  HStack,
} from "@chakra-ui/react";
import {
  ProgressBar,
  ProgressRoot,
  ProgressValueText,
} from "@/components/ui/progress";
import { ArrowLeftCircle, Home } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SummaryQuestion from "./SummaryQuestion";

const Summary = () => {
  const { summaryId } = useParams();
  const [quiz, setQuiz] = useState();
  const [summary, setSummary] = useState(null);
  const [answers, setAnswers] = useState();
  const [correct, setCorrect] = useState(null);
  const [incorrect, setIncorrect] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    const summ = attempts.find((attempt) => attempt.id == summaryId);

    if (!summ) {
      return router.replace("/");
    }

    setSummary(summ);
    const { quizId, answers } = summ;
    setAnswers(answers);

    fetch("/quizzes.json")
      .then((response) => response.json())
      .then((data) => setQuiz(data[quizId]))
      .catch((error) => console.error("Error fetching quizzes:", error));
  }, []);

  useEffect(() => {
    if (!quiz || !answers) return;

    const correct = answers.filter(
      (answer, index) => answer === quiz.questions[index].answer
    ).length;
    const incorrect = answers.length - correct;

    setCorrect(correct);
    setIncorrect(incorrect);
  }, [quiz, answers]);

  if (!quiz || correct == null) return "Loading...";

  return (
    <Container px={5} centerContent={true} gap={5}>
      <div className="flex justify-start">
        <Button variant="outline" onClick={() => router.push("/")}>
          <Home /> Back
        </Button>
      </div>
      <Card.Root overflow="hidden" className="drop-shadow w-full md:w-1/2">
        <Card.Body gap="5">
          <Card.Description>
            <Badge variant="surface" colorPalette="teal" marginEnd={1}>
              {quiz.category}
            </Badge>
          </Card.Description>
          <Card.Title className="text-2xl">{quiz.title}</Card.Title>
          <Card.Description>{quiz.questions.length} questions</Card.Description>
        </Card.Body>
      </Card.Root>

      <Card.Root overflow="hidden" className="drop-shadow w-full md:w-1/2">
        <Card.Body gap="5">
          <Card.Title>Summary</Card.Title>
          <ProgressRoot
            size="lg"
            value={(correct / answers.length) * 100}
            colorPalette="teal"
            striped
            animated
          >
            <HStack gap="5">
              <ProgressBar flex="1" />
              <ProgressValueText>
                {Math.round((correct / answers.length) * 100)}%
              </ProgressValueText>
            </HStack>
          </ProgressRoot>

          <div className="md:flex md:h-32 gap-2">
            <Badge
              colorPalette="green"
              className="w-full md:h-full py-10 flex justify-center text-center items-center text-xl"
            >
              {correct}
              <br />
              Correct
            </Badge>
            <Badge
              colorPalette="orange"
              className="w-full md:h-full py-10 flex justify-center text-center items-center text-xl"
            >
              {incorrect}
              <br />
              Incorrect
            </Badge>
          </div>
        </Card.Body>
      </Card.Root>

      <Heading className="text-xl">Questions</Heading>
      {quiz.questions.map((question, i) => (
        <SummaryQuestion question={question} answer={answers[i]} key={i} />
      ))}
    </Container>
  );
};

export default Summary;
