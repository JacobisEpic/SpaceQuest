import { Image, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Trivia from './components/Trivia';

export default function HomeScreen() {
  const [message, setMessage] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:5001';
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);  // Assuming the Flask response has a 'message' key
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('Failed to load message');
        setLoading(false);
      });
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Welcome Message</ThemedText>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <ThemedText>{message}</ThemedText>
        )}
      </ThemedView>
      {/* Add Trivia component here */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Trivia Questions</ThemedText>
        <Trivia />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      {/* Additional content... */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
