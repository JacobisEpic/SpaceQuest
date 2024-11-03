import React, { useState, useEffect, useRef } from 'react';
import { Platform, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ActivityIndicator, Button, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';

const Game1 = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isWeb, setIsWeb] = useState(Platform.OS === 'web');
  const videoRef = useRef(null);
  const cameraRef = useRef(null);

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

  if (hasPermission === null && !isWeb) {
    return <ActivityIndicator size="large" color="#FFFFFF" />;
  }
  
  if (hasPermission === false && !isWeb) {
    return <Text style={styles.permissionText}>No access to camera</Text>;
  }

  return (
    <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Game1 Screen</Text>
        <Button title="Back" color="#FF0000" onPress={() => navigation.goBack()} />
      </View>
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
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  cameraContainer: {
    width: '100%',
    height: 400, // Adjusted height for the camera feed container
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
  },
  capturedPhotoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  capturedPhotoText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  capturedPhoto: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default Game1;
