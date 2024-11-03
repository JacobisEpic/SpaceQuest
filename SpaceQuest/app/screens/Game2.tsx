<<<<<<< HEAD
=======
// // Game2.tsx
// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
// import he from 'he';

// const Game2 = () => {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchTriviaQuestions();
//   }, []);

//   const fetchTriviaQuestions = async () => {
//     try {
//       const response = await fetch('https://opentdb.com/api.php?amount=10&category=9&type=multiple');
//       const data = await response.json();
//       setQuestions(data.results);
//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch trivia questions:', error);
//       setLoading(false);
//     }
//   };

//   const handleAnswerSelect = (answer) => {
//     setSelectedAnswer(answer);

//     // Move to the next question after a short delay
//     setTimeout(() => {
//       setSelectedAnswer(null);
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     }, 1000);
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   if (currentQuestionIndex >= questions.length) {
//     return (
//       <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
//         <View style={styles.quizContainer}>
//           <Text style={styles.resultText}>You have completed the quiz!</Text>
//           <Button title="Play Again" onPress={() => {
//             setCurrentQuestionIndex(0);
//             setSelectedAnswer(null);
//           }} />
//         </View>
//       </ImageBackground>
//     );
//   }

//   const currentQuestion = questions[currentQuestionIndex];
//   const answerOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5);

//   return (
//     <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
//       <View style={styles.quizContainer}>
//         <Text style={styles.questionText}>{he.decode(currentQuestion.question)}</Text>
//         <View style={styles.optionsContainer}>
//           {answerOptions.map((option, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[
//                 styles.optionButton,
//                 selectedAnswer === option && (option === currentQuestion.correct_answer ? styles.correct : styles.incorrect)
//               ]}
//               onPress={() => handleAnswerSelect(option)}
//               disabled={selectedAnswer !== null}
//             >
//               <Text style={styles.optionText}>{he.decode(option)}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         {selectedAnswer && (
//           <Text style={styles.feedbackText}>
//             {selectedAnswer === currentQuestion.correct_answer ? "Correct!" : "Incorrect"}
//           </Text>
//         )}
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   quizContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   questionText: {
//     fontSize: 20,
//     marginBottom: 20,
//     textAlign: 'center',
//     color: 'white',
//   },
//   optionsContainer: {
//     marginBottom: 20,
//     width: '100%',
//   },
//   optionButton: {
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: '#81D4FA',
//     borderRadius: 5,
//     alignItems: 'center',
//     width: '100%',
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#fff',
//   },
//   feedbackText: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginVertical: 10,
//     color: 'white',
//   },
//   correct: {
//     backgroundColor: '#4CAF50',
//   },
//   incorrect: {
//     backgroundColor: '#F44336',
//   },
//   resultText: {
//     fontSize: 24,
//     textAlign: 'center',
//     marginBottom: 20,
//     color: 'white',
//   },
// });

// export default Game2;


// Game2.tsx
>>>>>>> origin/main
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import he from 'he';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';

const Game2 = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0); // Total points from Firebase
  const [hasUpdatedPoints, setHasUpdatedPoints] = useState(false); // Flag to ensure points are only added once

  const auth = getAuth();
  const user = auth.currentUser;
=======
  const [score, setScore] = useState(0); // Add score state
>>>>>>> origin/main

  useEffect(() => {
    fetchTriviaQuestions();
    if (user) {
      fetchUserPoints(); // Fetch the user's current total points when the component mounts
    }
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

  const fetchUserPoints = async () => {
    try {
      const database = getDatabase();
      const pointsRef = ref(database, `users/${user.uid}/points`);
      const snapshot = await get(pointsRef);
      if (snapshot.exists()) {
        setTotalPoints(snapshot.val() || 0);
      } else {
        console.log('No points data available');
      }
    } catch (error) {
      console.error('Failed to fetch user points:', error);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex].correct_answer) {
      setPoints(points + 1); // Increment points for correct answers
    }

    // Update score if the answer is correct
    if (answer === questions[currentQuestionIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }

    // Move to the next question after a short delay
    setTimeout(() => {
      setSelectedAnswer(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }, 1000);
  };

  const savePointsToDatabase = async () => {
    if (user && !hasUpdatedPoints) {
      try {
        const database = getDatabase();
        const pointsRef = ref(database, `users/${user.uid}/points`);
        const updatedPoints = totalPoints + points;

        await update(pointsRef, { points: updatedPoints });
        console.log('Points updated successfully in Firebase');
        setTotalPoints(updatedPoints);
        setHasUpdatedPoints(true); // Set flag to true to prevent re-adding points
      } catch (error) {
        console.error('Failed to update points:', error);
      }
    } else if (!user) {
      console.error('No user is logged in.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (currentQuestionIndex >= questions.length) {
<<<<<<< HEAD
    // Game is complete; show results and update Firebase
    savePointsToDatabase();
=======
    // Display total score at the end
>>>>>>> origin/main
    return (
      <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
        <View style={styles.quizContainer}>
          <Text style={styles.resultText}>You have completed the quiz!</Text>
<<<<<<< HEAD
          <Text style={styles.resultText}>Your Score: {points}</Text>
          <Text style={styles.resultText}>Total Points: {totalPoints + points}</Text>
=======
          <Text style={styles.resultText}>Your Total Score: {score}</Text>
>>>>>>> origin/main
          <Button title="Play Again" onPress={() => {
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedAnswer(null);
            setPoints(0);
            setHasUpdatedPoints(false); // Reset the flag for a new game
          }} />
        </View>
      </ImageBackground>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answerOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5);

  return (
    <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
      <View style={styles.header}>
        <Button title="Back" color="#FF0000" onPress={() => navigation.goBack()} />
        <Text style={styles.pointsText}>Points: {points}</Text>
      </View>
      <View style={styles.quizContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text> {/* Display current score */}
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
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pointsText: {
    fontSize: 18,
    color: 'yellow',
    fontWeight: 'bold',
  },
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scoreText: { // Style for the score display
    fontSize: 20,
    color: 'yellow',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
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
