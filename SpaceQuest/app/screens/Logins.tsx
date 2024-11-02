// Logins.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = getAuth();

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
            // Save user with default points set to 0
            set(ref(db, 'users/' + userCredential.user.uid), {
                email: email,
                points: 0  // Always default to 0 points upon creation
            });
            console.log('User registration and initial data setup successful');
        } catch (error) {
            alert("Sign up failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <Button title="Login" onPress={handleLogin} />
                        <Button title="Create Account" onPress={handleSignUp} />
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default Login;
