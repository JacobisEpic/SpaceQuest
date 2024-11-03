import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Button, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from "../../FirebaseConfig"; // Ensure this points to a valid Firestore instance
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

const Game3 = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [userInput, setUserInput] = useState('');
  const [randomNum, setRandomNum] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // gen random number between 1 and 3 to select an images
        const randomNumber = Math.floor(Math.random() * 3) + 1;
        setRandomNum(randomNumber);

        const storage = getStorage();
        const imageRef = ref(storage, `${randomNumber}.jpg`);

        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image:', error);
        Alert.alert('Error', 'Could not load the image. Please try again.');
      }
    };

    fetchImage();
  }, []);

  const handleGuess = async () => {
    try {
      const answerQuery = query(
        collection(db, "Answers"), 
        where("imageName", "==", `${randomNum}.jpg`)
      );

      const snapshot = await getDocs(answerQuery);

      if (snapshot.empty) {
        Alert.alert("No matching answer found.");
      } else {
        let correctAnswer = false;
        snapshot.forEach((doc) => {
          const answer = doc.data().item;
          if (answer.toLowerCase() === userInput.toLowerCase()) {
            correctAnswer = true;
          }
        });

        // set feedback message and its color based on correctness (red for incorrect and green for correct)
        if (correctAnswer) {
          setFeedbackMessage('Correct!');
          setIsCorrect(true);
        } else {
          setFeedbackMessage("Try Again! Close, but not quite right.");
          setIsCorrect(false);
        }
      }
    } catch (error) {
      console.error("Error querying documents:", error);
      Alert.alert("Error", "Could not check the answer. Please try again.");
    }

    setUserInput('');
  };

  return (
    <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.background}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>I spy with my little eye...</Text>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.loadingText}>Loading image...</Text>
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Enter your guess"
          placeholderTextColor="#aaa"
          value={userInput}
          onChangeText={setUserInput}
        />
        <TouchableOpacity onPress={handleGuess} style={styles.guessButton}>
          <Text style={styles.guessButtonText}>Submit Guess</Text>
        </TouchableOpacity>
        
        {feedbackMessage && (
          <Text style={[styles.feedbackMessage, isCorrect ? styles.correctText : styles.incorrectText]}>
            {feedbackMessage}
          </Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#FF0000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Orbitron',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // semi-transparent background
    borderRadius: 10,
    marginTop: 100,
  },
  title: {
    fontSize: 64,
    marginBottom: 20,
    color: '#FFFFFF',
    fontFamily: 'Orbitron',
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#FFFFFF',
    fontFamily: 'Orbitron',
  },
  feedbackMessage: {
    fontSize: 18,
    fontFamily: 'Orbitron',
    marginTop: 10,
  },
  correctText: {
    color: 'green',
  },
  incorrectText: {
    color: 'red',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 10,
    color: '#FFFFFF',
    backgroundColor: '#333',
    borderRadius: 5,
    fontFamily: 'Orbitron',
  },
  guessButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  guessButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Orbitron',
  },
});

export default Game3;
