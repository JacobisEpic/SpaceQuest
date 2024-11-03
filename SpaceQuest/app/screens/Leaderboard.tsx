// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, ScrollView, ImageBackground } from 'react-native';
// import { database } from '../../FirebaseConfig';
// import { ref, onValue, off, DataSnapshot } from 'firebase/database';
// import { StackNavigationProp } from '@react-navigation/stack';

// type Props = {
//     navigation: StackNavigationProp<any>;
// };

// interface User {
//     id: string;
//     email: string;
//     points: number;
//     username: string;
// }

// const Leaderboard: React.FC<Props> = ({ navigation }) => {
//     const [users, setUsers] = useState<User[]>([]);

//     useEffect(() => {
//         const usersRef = ref(database, 'users');
//         const handleData = (snapshot: DataSnapshot) => {
//             const usersData = snapshot.val();
//             if (usersData) {
//                 const loadedUsers: User[] = Object.keys(usersData).map(userId => {
//                     const userData = usersData[userId];
//                     return {
//                         id: userId,
//                         email: userData.email || 'No email',
//                         username: userData.username || 'No username',
//                         points: userData.points || 0
//                     };
//                 });
//                 loadedUsers.sort((a, b) => b.points - a.points);
//                 setUsers(loadedUsers);
//             } else {
//                 console.log("No data available");
//                 setUsers([]);
//             }
//         };

//         onValue(usersRef, handleData, error => {
//             console.error("Firebase read failed: " + error.message);
//         });

//         return () => off(usersRef, 'value', handleData);
//     }, []);

//     return (
//         <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
//             <Text style={styles.title}>Leaderboard</Text>
//             <ScrollView>
//                 <View style={styles.tableHeader}>
//                     <Text style={styles.headerText}>Rank</Text>
//                     <Text style={styles.headerText}>Username</Text>
//                     <Text style={styles.headerText}>Points</Text>
//                 </View>
//                 {users.map((user, index) => (
//                     <View key={user.id} style={styles.tableRow}>
//                         <Text style={styles.rowText}>{index + 1}</Text>
//                         <Text style={styles.rowText}>{user.username}</Text>
//                         <Text style={styles.rowText}>{user.points}</Text>
//                     </View>
//                 ))}
//             </ScrollView>
//             <Button title="Back" onPress={() => navigation.goBack()} color="#FFAB91" />
//         </ImageBackground>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//         width: '100%',
//         height: '100%',
//     },
//     title: {
//         fontFamily: 'Orbitron',
//         fontSize: 24,
//         color: '#FFFFFF',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     tableHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         width: '100%',  // Ensure full width
//         borderBottomWidth: 1,
//         borderBottomColor: '#FFFFFF',
//         paddingBottom: 10,
//     },
//     headerText: {
//         flex: 1,
//         fontSize: 18,
//         color: '#FFFFFF',
//         fontWeight: 'bold',
//         fontFamily: 'Orbitron',  // Apply Orbitron to header text
//         textAlign: 'center',
//         paddingHorizontal: 5,  // Add horizontal padding
//     },
//     tableRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         width: '100%',  // Ensure each row matches the header width
//         paddingVertical: 10,
//     },
//     rowText: {
//         flex: 1,  // Even spacing
//         fontSize: 16,
//         color: '#FFFFFF',
//         fontFamily: 'Orbitron',  // Apply Orbitron to row text
//         textAlign: 'center',
//         paddingHorizontal: 5,  // Add horizontal padding for separation
//     }
// });


// export default Leaderboard;
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { database } from '../../FirebaseConfig';
import { ref, onValue } from 'firebase/database';
import { StackNavigationProp } from '@react-navigation/stack';

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

    useEffect(() => {
        const usersRef = ref(database, 'users');

        const unsubscribe = onValue(usersRef, (snapshot: DataSnapshot) => {
            const usersData = snapshot.val();
            console.log("Retrieved usersData from Firebase:", usersData); // Log the raw data

            if (usersData) {
                const loadedUsers: User[] = Object.keys(usersData).map(userId => {
                    const userData = usersData[userId];
                    return {
                        id: userId,
                        email: userData.email || 'No email',
                        username: userData.username || 'No username',
                        points: userData.points || 0
                    };
                });

                loadedUsers.sort((a, b) => b.points - a.points);
                console.log("Loaded and sorted users:", loadedUsers); // Log the processed user data
                setUsers(loadedUsers);
            } else {
                console.log("No data available in 'users' node");
                setUsers([]);
            }
        }, error => {
            console.error("Firebase read failed:", error.message);
        });

        return () => unsubscribe(); // Correct cleanup
    }, []);

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
                    users.map((user, index) => {
                        // Additional logging to check each user's data
                        console.log("Rendering user:", user);
                        return (
                            <View key={user.id} style={styles.tableRow}>
                                <Text style={styles.rowText}>{index + 1}</Text>
                                <Text style={styles.rowText}>{user.username || 'No username'}</Text>
                                <Text style={styles.rowText}>{user.points.toString()}</Text>
                            </View>
                        );
                    })
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
        padding: 20,
        width: '100%',
        height: '100%',
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
