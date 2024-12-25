"use client";
import { Button } from "@/components/ui/button";
import { Badge, Card, Container, HStack, Image, Text } from "@chakra-ui/react";
import { ArrowLeftCircle, ChevronRight, PlayCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const StartPage = () => {
  const [quiz, setQuiz] = useState();
  const { quizId } = useParams();
  const [prevAttempts, setPrevAttempts] = useState();

  const router = useRouter();

  useEffect(() => {
    const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    console.log(attempts);
    setPrevAttempts(attempts.filter((attempt) => attempt.quizId == quizId));

    fetch("/quizzes.json")
      .then((response) => response.json())
      .then((data) => setQuiz(data[quizId]))
      .catch((error) => console.error("Error fetching quizzes:", error));
  }, []);
  if (!quiz) return "Loading...";
  return (
    <Container px={20} centerContent={true} gap={10}>
      <Card.Root overflow="hidden" className="drop-shadow w-full md:w-1/2">
        <Card.Body gap="5">
          <div>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeftCircle /> Back
            </Button>
          </div>
          <Card.Description>
            <Badge variant="surface" colorPalette="teal" marginEnd={1}>
              {quiz.category}
            </Badge>
            {/* <Badge variant="surface" colorPalette="purple">
              {quiz.questions.length} questions
            </Badge> */}
          </Card.Description>
          <Card.Title className="text-2xl">{quiz.title}</Card.Title>
          <Card.Description>{quiz.questions.length} questions</Card.Description>
        </Card.Body>
      </Card.Root>

      <Card.Root overflow="hidden" className="drop-shadow w-full md:w-1/2">
        <Card.Body gap="5">
          <Button
            variant="solid"
            onClick={() => router.replace(`/quiz/${quizId}`)}
          >
            <PlayCircle /> Start Quiz
          </Button>
        </Card.Body>
      </Card.Root>

      <Card.Root overflow="hidden" className="drop-shadow w-full md:w-1/2">
        <Card.Body gap="5">
          <Card.Title className="text-xl">Previous attempts</Card.Title>
          {prevAttempts.length
            ? prevAttempts.map(({ id, answers }) => {
                const correct = answers.filter(
                  (answer, index) => answer === quiz.questions[index].answer
                ).length;
                const incorrect = answers.length - correct;
                return (
                  <Card.Root
                    key={id}
                    className="hover:bg-slate-100/5 cursor-pointer"
                    onClick={() => router.push(`/quiz/summary/${id}`)}
                  >
                    <Card.Body>
                      <HStack>
                        <div className="flex-1">
                          <Text>{new Date(id).toDateString()}</Text>
                          <Text>
                            {Math.round((correct / answers.length) * 100)}%
                            accuracy
                          </Text>
                        </div>
                        <ChevronRight />
                      </HStack>
                    </Card.Body>
                  </Card.Root>
                );
              })
            : "No attempts yet"}
        </Card.Body>
      </Card.Root>
    </Container>
  );
};

export default StartPage;
