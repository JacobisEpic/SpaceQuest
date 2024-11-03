import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { useFonts } from 'expo-font';

const List = ({ navigation }) => {
    const auth = getAuth();
    const [username, setUsername] = useState<string>('');

    const [fontsLoaded] = useFonts({
        'Orbitron': require('../../assets/fonts/Orbitron-VariableFont_wght.ttf'),
    });

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

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#FFFFFF" />;
    }

    return (
        <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    {username && <Text style={styles.username}>Welcome, {username}</Text>}
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.menuTitle}>Menu</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.leaderboardContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')} style={styles.moonButton}>
                        <Image source={require('../../assets/moon.png')} style={styles.moonImage} />
                    </TouchableOpacity>
                    <Text style={styles.moonText}>Leaderboard</Text>
                </View>

                {/* Game Buttons as Asteroids */}
                <View style={styles.asteroidContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Game1')} style={styles.asteroidButton}>
                        <Image source={require('../../assets/Asteroid.png')} style={styles.asteroidImage} />
                        <Text style={styles.asteroidText}>Game 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Game2')} style={styles.asteroidButton}>
                        <Image source={require('../../assets/Asteroid.png')} style={styles.asteroidImage} />
                        <Text style={styles.asteroidText}>Game 2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Game3')} style={styles.asteroidButton}>
                        <Image source={require('../../assets/Asteroid.png')} style={styles.asteroidImage} />
                        <Text style={styles.asteroidText}>Game 3</Text>
                    </TouchableOpacity>
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
        height: '100%',
    },
    header: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 80, // Increased padding at the top for more margin
        paddingBottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuTitle: {
        fontSize: 64,
        color: 'white',
        fontFamily: 'Orbitron',
        marginBottom: 10,
    },
    headerContent: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    username: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Orbitron',
    },
    logoutButton: {
        backgroundColor: '#FF0000',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Orbitron',
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    leaderboardContainer: {
        alignItems: 'center', // Center the text below the moon image
        marginRight: 20,
    },
    moonButton: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moonImage: {
        width: '100%',
        height: '100%',
    },
    moonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        backgroundColor: 'transparent',
        fontFamily: 'Orbitron',
        marginTop: 5, // Margin to separate text from the image
    },
    asteroidContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    asteroidButton: {
        alignItems: 'center',
        marginVertical: 10,
    },
    asteroidImage: {
        width: 100,
        height: 100,
    },
    asteroidText: {
        color: 'white',
        fontSize: 16,
        marginTop: 5,
        fontFamily: 'Orbitron',
    },
});

export default List;
