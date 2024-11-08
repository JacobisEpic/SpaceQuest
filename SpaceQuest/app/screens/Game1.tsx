import React, { useState, useEffect, useRef } from 'react';
import { Platform, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { Camera } from 'expo-camera';
import { getAuth } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, update } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

const Game1 = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isWeb, setIsWeb] = useState(Platform.OS === 'web');
  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const auth = getAuth();

  const [fontsLoaded] = useFonts({
    Orbitron: require('../../assets/fonts/Orbitron-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (isWeb) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Camera access denied:", error);
          setHasPermission(false);
        });
    } else {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, []);

  const capturePhoto = async () => {
    if (isWeb && videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedPhoto(imageDataUrl);
    } else if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
    }
  };

  const uploadPhotoToFirebase = async (photoUri, game) => {
    try {
      const storage = getStorage();
      const database = getDatabase();
      const user = auth.currentUser;

      if (user) {
        const uniqueFileName = uuidv4() + '.jpg';
        const storageReference = storageRef(storage, `photos/${game}/${uniqueFileName}`);
        
        const response = await fetch(photoUri);
        const blob = await response.blob();

        await uploadBytes(storageReference, blob);
        const downloadURL = await getDownloadURL(storageReference);

        const photoRef = dbRef(database, `users/${user.uid}/${game}`);
        await update(photoRef, {
          [uniqueFileName]: {
            url: downloadURL,
            timestamp: Date.now(),
          }
        });

        console.log(`Photo uploaded to ${game} and URL saved:`, downloadURL);
      } else {
        console.error("No user is logged in.");
      }
    } catch (error) {
      console.error("Failed to upload photo:", error);
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#FFFFFF" />;
  }

  if (hasPermission === null && !isWeb) {
    return <ActivityIndicator size="large" color="#FFFFFF" />;
  }
  
  if (hasPermission === false && !isWeb) {
    return <Text style={styles.permissionText}>No access to camera</Text>;
  }

  return (
    <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Image Capture</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cameraContainer}>
          {isWeb ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={styles.preview}
            />
          ) : (
            <Camera
              ref={cameraRef}
              style={styles.preview}
              type={Camera.Constants.Type.back}
              onCameraReady={() => setIsCameraReady(true)}
            />
          )}
          {!isCameraReady && !isWeb && <ActivityIndicator size="large" color="#FFFFFF" style={styles.loading} />}
        </View>

        <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
          <Text style={styles.captureButtonText}>Capture</Text>
        </TouchableOpacity>

        {capturedPhoto && (
          <View style={styles.capturedPhotoContainer}>
            <Text style={styles.capturedPhotoText}>Captured Photo:</Text>
            <Image source={{ uri: capturedPhoto }} style={styles.capturedPhoto} />
            
            <View style={styles.uploadButtonsContainer}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => uploadPhotoToFirebase(capturedPhoto, 'jigsaw')}
              >
                <Text style={styles.uploadButtonText}>Upload to Jigsaw</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => uploadPhotoToFirebase(capturedPhoto, 'iSpy')}
              >
                <Text style={styles.uploadButtonText}>Upload to I Spy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
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
  title: {
    fontSize: 64,
    color: 'white',
    textAlign: 'center',
    marginTop: 80,
    fontFamily: 'Orbitron',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  cameraContainer: {
    width: '100%',
    height: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  loading: {
    position: 'absolute',
    alignSelf: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Orbitron',
  },
  captureButton: {
    backgroundColor: '#81D4FA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Orbitron',
  },
  capturedPhotoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  capturedPhotoText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Orbitron',
  },
  capturedPhoto: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    width: '80%',
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Orbitron',
  },
});

export default Game1;
