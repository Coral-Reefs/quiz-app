import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  GridItem,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

const QuizItem = ({ quiz: { id, title, image, questions } }) => {
  const router = useRouter();
  return (
    <GridItem
      colSpan={1}
      className="cursor-pointer"
      onClick={() => router.push(`quiz/${id}/start`)}
    >
      <Card.Root
        maxW="xs"
        overflow="hidden"
        className="drop-shadow hover:drop-shadow-lg duration-300"
      >
        <Image src={image} className="h-32" alt="thumbnail" />

        <Card.Body gap="2">
          <Card.Description>
            <Badge variant="surface" colorPalette="purple">
              {questions.length} questions
            </Badge>
          </Card.Description>
          <Card.Title>{title}</Card.Title>
        </Card.Body>
      </Card.Root>
    </GridItem>
  );
};

export default QuizItem;
