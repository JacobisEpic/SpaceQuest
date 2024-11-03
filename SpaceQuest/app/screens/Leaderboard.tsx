import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { database } from '../../FirebaseConfig';
import { ref, onValue, off, DataSnapshot } from 'firebase/database';

interface User {
    id: string;
    email: string;
    points: number;
    username: string;
}

const Leaderboard = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const usersRef = ref(database, 'users');
        const handleData = (snapshot: DataSnapshot) => {
            const usersData = snapshot.val();
            if (usersData) {
                const loadedUsers: User[] = Object.keys(usersData).map(userId => {
                    const userData = usersData[userId];
                    return {
                        id: userId,
                        email: userData.email || 'No email', // Correct use of email field
                        username: userData.username || 'No username', // Correct use of username field
                        points: userData.points || 0 // Default points if not available
                    };
                });
                // Sorting users by points in descending order
                loadedUsers.sort((a, b) => b.points - a.points);
                setUsers(loadedUsers);
            } else {
                console.log("No data available");
                setUsers([]);
            }
        };

        onValue(usersRef, handleData, error => {
            console.error("Firebase read failed: " + error.message);
        });

        // Unsubscribe from the realtime listener when the component unmounts
        return () => off(usersRef, 'value', handleData);
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Leaderboard Screen</Text>
            {users.map(user => (
                <Text key={user.id}>{user.username}: {user.points}</Text> // Displaying username instead of email
            ))}
        </View>
    );
};

export default Leaderboard;
