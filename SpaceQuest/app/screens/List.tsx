// List.tsx
import React from 'react';
import { View, Button } from 'react-native';
import { getAuth, signOut } from "firebase/auth";

const List = ({ navigation }) => {
  const auth = getAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={() => navigation.navigate('Details')} title="Open Details" />
        <Button onPress={() => navigation.navigate('Leaderboard')} title="Open Leaderboard" />
        <Button onPress={() => signOut(auth)} title="Logout" />
    </View>
  );
}

export default List;
