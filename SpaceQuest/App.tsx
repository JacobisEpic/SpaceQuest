import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Logins'; // Ensure this is the correct path
import List from './app/screens/List';
import Details from './app/screens/Details';
import Profile from './app/screens/Profile';
import Leaderboard from './app/screens/Leaderboard'; // Make sure Leaderboard is correctly imported
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { app, auth, database } from './FirebaseConfig'; // Ensure Firebase Auth is correctly set up

const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="List" component={List} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Leaderboard" component={Leaderboard} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default App;
