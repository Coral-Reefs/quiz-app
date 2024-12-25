"use client";
import { useEffect, useState } from "react";
import QuizItem from "./components/QuizItem";
import { Container, Grid, Heading, Input } from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { Search } from "lucide-react";

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState(["Maths", "Science", "English"]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredQuizzes, setFilteredQuizzes] = useState(quizzes); // State for filtered quizzes

  useEffect(() => {
    fetch("/quizzes.json")
      .then((response) => response.json())
      .then((data) => setQuizzes(data))
      .catch((error) => console.error("Error fetching quizzes:", error));
  }, []);

  useEffect(() => {
    const filtered = quizzes.filter((quiz) => {
      // Improved search logic:
      // - Lowercase both search term and quiz properties for case-insensitive search
      // - Search across quiz title, category, and description (if available)
      const searchTextLower = searchTerm.toLowerCase();
      const quizTitleLower = quiz.title.toLowerCase();
      const quizCategoryLower = quiz.category.toLowerCase();
      const quizDescriptionLower = quiz.description?.toLowerCase(); // Optional search in description

      return (
        quizTitleLower.includes(searchTextLower) ||
        quizCategoryLower.includes(searchTextLower) ||
        (quizDescriptionLower && quizDescriptionLower.includes(searchTextLower))
      );
    });
    setFilteredQuizzes(filtered);
  }, [quizzes, searchTerm]); // Re-filter on quizzes or search term change

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container px="20" py={10}>
      <Heading className="text-4xl mb-4">Quizzes</Heading>
      <InputGroup mb={4} className="w-full" endElement={<Search />}>
        <Input
          placeholder="Search quizzes..."
          className="outline-none p-4 rounded-lg"
          variant="subtle"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>
      {categories.map((category, i) => (
        <div key={i} className="mb-5">
          {filteredQuizzes.filter((quiz) => quiz.category === category).length >
            0 && <Heading className="text-2xl py-3">⭐ {category}</Heading>}
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap="6"
          >
            {filteredQuizzes
              .filter((quiz) => quiz.category === category)
              .map((quiz) => (
                <QuizItem quiz={quiz} key={quiz.id} />
              ))}
          </Grid>
        </div>
      ))}
    </Container>
  );
}
