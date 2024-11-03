// Game2.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import he from 'he';

const Game2 = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTriviaQuestions();
  }, []);

  const fetchTriviaQuestions = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&category=9&type=multiple');
      const data = await response.json();
      setQuestions(data.results);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch trivia questions:', error);
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);

    // Move to the next question after a short delay
    setTimeout(() => {
      setSelectedAnswer(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }, 1000);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
        <View style={styles.quizContainer}>
          <Text style={styles.resultText}>You have completed the quiz!</Text>
          <Button title="Play Again" onPress={() => {
            setCurrentQuestionIndex(0);
            setSelectedAnswer(null);
          }} />
        </View>
      </ImageBackground>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answerOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5);

  return (
    <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
      <View style={styles.quizContainer}>
        <Text style={styles.questionText}>{he.decode(currentQuestion.question)}</Text>
        <View style={styles.optionsContainer}>
          {answerOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === option && (option === currentQuestion.correct_answer ? styles.correct : styles.incorrect)
              ]}
              onPress={() => handleAnswerSelect(option)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.optionText}>{he.decode(option)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedAnswer && (
          <Text style={styles.feedbackText}>
            {selectedAnswer === currentQuestion.correct_answer ? "Correct!" : "Incorrect"}
          </Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  optionsContainer: {
    marginBottom: 20,
    width: '100%',
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#81D4FA',
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  feedbackText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    color: 'white',
  },
  correct: {
    backgroundColor: '#4CAF50',
  },
  incorrect: {
    backgroundColor: '#F44336',
  },
  resultText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
});

export default Game2;
