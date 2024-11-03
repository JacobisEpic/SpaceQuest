import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { database } from '../../FirebaseConfig';
import { ref, onValue } from 'firebase/database';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFonts } from 'expo-font';

type Props = {
    navigation: StackNavigationProp<any>;
};

interface User {
    id: string;
    email: string;
    points: number;
    username: string;
}

const Leaderboard: React.FC<Props> = ({ navigation }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [fontsLoaded] = useFonts({
        'Orbitron': require('../../assets/fonts/Orbitron-VariableFont_wght.ttf'),
    });

    useEffect(() => {
        const usersRef = ref(database, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const usersData = snapshot.val();
            if (usersData) {
                const loadedUsers: User[] = Object.keys(usersData).map(userId => ({
                    id: userId,
                    email: usersData[userId].email || 'No email',
                    username: usersData[userId].username || 'No username',
                    points: usersData[userId].points || 0
                }));
                loadedUsers.sort((a, b) => b.points - a.points);
                setUsers(loadedUsers);
            } else {
                setUsers([]);
            }
        }, error => {
            console.error("Firebase read failed:", error.message);
        });

        return () => unsubscribe();
    }, []);

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#FFFFFF" />;
    }

    return (
        <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>
            <ScrollView>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>Rank</Text>
                    <Text style={styles.headerText}>Username</Text>
                    <Text style={styles.headerText}>Points</Text>
                </View>
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <View key={user.id} style={styles.tableRow}>
                            <Text style={styles.rowText}>{index + 1}</Text>
                            <Text style={styles.rowText}>{user.username || 'No username'}</Text>
                            <Text style={styles.rowText}>{user.points.toString()}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>No users to display</Text>
                )}
            </ScrollView>
            <Button title="Back" onPress={() => navigation.goBack()} color="#FFAB91" />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        paddingTop: 80,
        paddingBottom: 80,
        backgroundColor: 'black', // Ensures no white background shows through
    },
    title: {
        fontFamily: 'Orbitron',
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#FFFFFF',
        paddingBottom: 10,
    },
    headerText: {
        flex: 1,
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Orbitron',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 10,
    },
    rowText: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'Orbitron',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    noDataText: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Leaderboard;
