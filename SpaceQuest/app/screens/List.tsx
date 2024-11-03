import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const List = ({ navigation }) => {
    const auth = getAuth();
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                const usernameRef = ref(getDatabase(), 'users/' + user.uid + '/username');
                onValue(usernameRef, snapshot => {
                    setUsername(snapshot.val() || 'Anonymous');
                }, { onlyOnce: true });
            } else {
                setUsername('');
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => setUsername(''))
            .catch(error => console.error('Logout failed:', error));
    };

    return (
        <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
            <View style={styles.header}>
                {username && <Text style={styles.username}>Welcome, {username}</Text>}
                <Button color="#FF0000" onPress={handleLogout} title="Logout" />
            </View>
            <View style={styles.body}>
                <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')} style={styles.moonButton}>
                    <ImageBackground source={require('../../assets/moon.png')} style={styles.moonImage}>
                        <Text style={styles.moonText}>Open Leaderboard</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <View style={styles.optionsContainer}>
                    <Button color="#81D4FA" onPress={() => navigation.navigate('Details')} title="Open Details" style={styles.optionButton} />
                    <Button color="#81D4FA" onPress={() => navigation.navigate('Game1')} title="Open Game1" style={styles.optionButton} />
                    <Button color="#81D4FA" onPress={() => navigation.navigate('Game2')} title="Open Game2" style={styles.optionButton} />
                    <Button color="#81D4FA" onPress={() => navigation.navigate('Game3')} title="Open Game3" style={styles.optionButton} />

                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    username: {
        fontSize: 18,
        color: 'white'
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20
    },
    moonButton: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20 // Added right margin for spacing
    },
    moonImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    moonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'transparent'
    },
    optionsContainer: {
        flexDirection: 'column', // Stack buttons vertically
        alignItems: 'center'
    },
    optionButton: {
        marginBottom: 10 // Space between buttons
    }
});

export default List;
