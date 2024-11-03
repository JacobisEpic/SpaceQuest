import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Text, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../FirebaseConfig';
import { getDatabase, ref, set } from 'firebase/database';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const [fontsLoaded] = useFonts({
        'Orbitron': require('../../assets/fonts/Orbitron-VariableFont_wght.ttf'),
    });

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#FFFFFF" />;
    }

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);

            console.log('Login successful');
        } catch (error) {
            alert("Login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const db = getDatabase();
            set(ref(db, 'users/' + userCredential.user.uid), {
                email: email,
                username: username,  // Store the username
                points: 0  // Default points
            });
            console.log('User registration and initial data setup successful');
        } catch (error) {
            alert("Sign up failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
            <Text style={styles.title}>SpaceQuest</Text>
            <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#ccc"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#ccc"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#ccc"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#4CAF50" />
                ) : (
                    <View style={styles.buttonContainer}>
                        <Button title="Create Account" onPress={handleSignUp} color="#0000FF" />
                        <Button title="Login" onPress={handleLogin} color="#0000FF" />
                    </View>
                )}
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    title: {
        fontFamily: 'Orbitron',
        fontSize: 64,
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    keyboardView: {
        width: '100%',
        alignItems: 'center'  // Centers the children horizontally
    },
    input: {
        height: 40,
        width: '80%',  // Controls the width of the input fields
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#555',
        padding: 10,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',  // Matches the input field width
    }
});

export default Login;
