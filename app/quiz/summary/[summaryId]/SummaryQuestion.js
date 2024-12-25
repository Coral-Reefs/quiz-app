import { Badge, Card, Text } from "@chakra-ui/react";
import { Check, X } from "lucide-react";
import React from "react";

const SummaryQuestion = ({ question, answer }) => {
  return (
    <Card.Root className="w-full md:w-1/2 drop-shadow">
      {answer == question.answer ? (
        <Badge
          size="sm"
          colorPalette="green"
          className="rounded-b-none rounded-t-lg"
        />
      ) : (
        <Badge size="sm" colorPalette="red" />
      )}
      <Card.Body gap={5}>
        <Card.Title>{question.question}</Card.Title>
        {question.options.map((option, i) => (
          <Text key={i} className="flex items-center gap-3">
            <Badge
              variant="surface"
              size="sm"
              colorPalette={
                answer == option
                  ? answer == question.answer
                    ? "green"
                    : "red"
                  : option == question.answer
                  ? "green"
                  : "gray"
              }
              className="rounded-full h-4 w-5 p-1"
            >
              {answer == option ? (
                answer == question.answer ? (
                  <Check />
                ) : (
                  <X />
                )
              ) : (
                option == question.answer && <Check />
              )}
            </Badge>
            {option}
          </Text>
        ))}
        {answer != question.answer && (
          <Text>Correct answer: {question.answer}</Text>
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default SummaryQuestion;
