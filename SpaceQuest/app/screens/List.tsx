// import React, { useState, useEffect } from 'react';
// import { View, Button, Text, StyleSheet } from 'react-native';
// import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { getDatabase, ref, onValue } from "firebase/database";

// type Props = {
//     navigation: StackNavigationProp<any>;
// }

// const List: React.FC<Props> = ({ navigation }) => {
//     const auth = getAuth();
//     const [username, setUsername] = useState<string>('');

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 const usernameRef = ref(getDatabase(), 'users/' + user.uid + '/username');
//                 onValue(usernameRef, (snapshot) => {
//                     setUsername(snapshot.val() || 'Anonymous'); // Fallback to 'Anonymous' if no username is set
//                 }, {
//                     onlyOnce: true // Listen only once for the username
//                 });
//             } else {
//                 setUsername(''); // Clear username if no user is logged in
//             }
//         });

//         return () => unsubscribe(); // Cleanup subscription
//     }, []);

//     const handleLogout = () => {
//         signOut(auth).then(() => {
//             // Possibly navigate to a login screen or update the UI to reflect logged out state
//             setUsername('');
//         }).catch((error) => {
//             console.error('Logout failed:', error);
//         });
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 {username && <Text style={styles.username}>Welcome, {username}</Text>}
//                 <Button onPress={handleLogout} title="Logout" />
//             </View>
//             <View style={styles.body}>
//                 <Button onPress={() => navigation.navigate('Details')} title="Open Details" />
//                 <Button onPress={() => navigation.navigate('Leaderboard')} title="Open Leaderboard" />
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     header: {
//         width: '100%',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 10
//     },
//     username: {
//         fontSize: 18
//     },
//     body: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     }
// });

// export default List;
import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, ImageBackground } from 'react-native';
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
                <Button color="#4CAF50" onPress={handleLogout} title="Logout" />
            </View>
            <View style={styles.body}>
                <Button color="#81D4FA" onPress={() => navigation.navigate('Details')} title="Open Details" />
                <Button color="#FFAB91" onPress={() => navigation.navigate('Leaderboard')} title="Open Leaderboard" />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', // Ensure full width
        height: '100%' // Ensure full height
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent overlay
    },
    username: {
        fontSize: 18,
        color: 'white'
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default List;
