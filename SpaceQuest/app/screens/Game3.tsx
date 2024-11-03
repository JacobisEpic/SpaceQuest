import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Button } from 'react-native';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';


import { db } from "../../FirebaseConfig"; // Assuming you have a firebaseConfig.ts file
import { collection, query, where, getDocs } from "firebase/firestore";



const Details = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [userInput, setUserInput] = useState('');
  const [randomNum, setRandomNum] = useState(0);


  // Function to handle button press
  // const handleGuess = () => {
  //   console.log("User's Guess:", userInput);
  //   // You can add more logic here, such as sending the guess to a server or processing it
  //   setUserInput(''); // Clear the input after submission
  // };

  const handleGuess = () => {
    // Query Firestore for the guess
    const q = query(collection(db, "Answers"), where("imageName", "==", (randomNum + ".jpg"))); // Replace "yourCollectionName" and "fieldToCompare" with your actual values
  
    getDocs(q)
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No matching documents found.");
          // Handle the case where no matching document is found
        } else {
          snapshot.docs.forEach((doc) => {
            console.log("Document data:", doc.data());
            // Process the document data here

            if(doc.data().item == userInput){
              console.log("yay you got it!");
            }else{
              console.log("close but not close enough");
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
    setUserInput(''); // Clear the input after submission
  };

  useEffect(() => {
    const storage = getStorage();

    // Generate a random number between 1 and 3
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    console.log("Random Number:", randomNumber); // You can log it or use it as needed

    setRandomNum(randomNumber);

    // Use the random number to create a unique image reference
    const imageRef = ref(storage, `gs://spacequest-9a55d.firebasestorage.app/${randomNumber}.jpg`); // Adjust the image naming convention as needed
    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.error('Error getting image URL:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>I spy from my little eye... </Text>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}

      {/* Input Box */}
      <TextInput
        style={styles.input}
        placeholder="Enter your guess"
        value={userInput}
        onChangeText={setUserInput} // Update the state with input value
      />

      <Button title="Submit Guess" onPress={handleGuess} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
  },  
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%', // Adjust width as needed
  },
});

export default Details;
