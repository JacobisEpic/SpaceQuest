// In /app/screens/Profile.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";

const Profile = () => {
    const [newPoints, setNewPoints] = useState('');
    const auth = getAuth();

    const handleUpdatePoints = () => {
        if (auth.currentUser) {
            const db = getDatabase();
            const userRef = ref(db, `users/${auth.currentUser.uid}`);
            update(userRef, {
                points: newPoints
            }).then(() => {
                console.log("Points updated successfully.");
            }).catch(error => {
                console.error("Error updating points:", error);
            });
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Update Points"
                value={newPoints}
                onChangeText={setNewPoints}
                keyboardType="number-pad"
            />
            <Button title="Update Points" onPress={handleUpdatePoints} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default Profile;
