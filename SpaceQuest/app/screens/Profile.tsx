import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, update, push } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const [userData, setUserData] = useState({ username: '', points: 0 });
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFriendEmail, setNewFriendEmail] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Orbitron: require('../../assets/fonts/Orbitron-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchFriendsAndRequests();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserData({
          username: data.username || 'No username',
          points: data.points || 0,
        });
      } else {
        console.log('No user data available');
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendsAndRequests = async () => {
    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const friendsWithNames = await fetchUsernames(data.friends || []);
        const incomingRequestsWithNames = await fetchUsernames(data.friendRequests || []);
        const outgoingRequestsWithNames = await fetchUsernames(data.outgoingRequests || []);

        setFriends(friendsWithNames);
        setFriendRequests(incomingRequestsWithNames);
        setOutgoingRequests(outgoingRequestsWithNames);
      }
    } catch (error) {
      console.error('Failed to fetch friends and requests:', error);
    }
  };

  const fetchUsernames = async (uids) => {
    const database = getDatabase();
    const usernames = [];

    for (const uid of uids) {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        usernames.push({
          uid,
          username: snapshot.val().username || 'Unknown User',
        });
      }
    }

    return usernames;
  };

  const sendFriendRequest = async () => {
    if (!newFriendEmail) return;
    try {
      const database = getDatabase();
      const usersRef = ref(database, 'users');
      const usersSnapshot = await get(usersRef);

      if (usersSnapshot.exists()) {
        const users = usersSnapshot.val();
        let friendUid = null;

        for (const uid in users) {
          if (users[uid].email === newFriendEmail) {
            friendUid = uid;
            break;
          }
        }

        if (friendUid) {
          const friendRequestsRef = ref(database, `users/${friendUid}/friendRequests`);
          await push(friendRequestsRef, user.uid);

          const outgoingRequestsRef = ref(database, `users/${user.uid}/outgoingRequests`);
          await push(outgoingRequestsRef, friendUid);

          console.log('Friend request sent successfully');
          setOutgoingRequests([...outgoingRequests, { uid: friendUid, username: users[friendUid].username }]);
          setNewFriendEmail('');
        } else {
          console.log('User not found');
        }
      }
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const acceptFriendRequest = async (requesterUid) => {
    try {
      const database = getDatabase();

      const userFriendsRef = ref(database, `users/${user.uid}/friends`);
      const requesterFriendsRef = ref(database, `users/${requesterUid}/friends`);
      await push(userFriendsRef, requesterUid);
      await push(requesterFriendsRef, user.uid);

      const userFriendRequestsRef = ref(database, `users/${user.uid}/friendRequests`);
      const updatedRequests = friendRequests.filter((request) => request.uid !== requesterUid);
      await update(userFriendRequestsRef, updatedRequests);

      console.log('Friend request accepted');
      setFriends([...friends, { uid: requesterUid, username: updatedRequests.username }]);
      setFriendRequests(updatedRequests);
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.text}>Username: {userData.username}</Text>
        <Text style={styles.text}>Points: {userData.points}</Text>

        <Text style={styles.subtitle}>Friends</Text>
        <FlatList
          data={friends}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => <Text style={styles.text}>{item.username}</Text>}
          ListEmptyComponent={<Text style={styles.text}>No friends yet</Text>}
        />

        <Text style={styles.subtitle}>Incoming Friend Requests</Text>
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View style={styles.requestContainer}>
              <Text style={styles.text}>{item.username}</Text>
              <TouchableOpacity onPress={() => acceptFriendRequest(item.uid)} style={styles.acceptButton}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.text}>No friend requests</Text>}
        />

        <Text style={styles.subtitle}>Outgoing Friend Requests</Text>
        <FlatList
          data={outgoingRequests}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => <Text style={styles.text}>{item.username}</Text>}
          ListEmptyComponent={<Text style={styles.text}>No outgoing requests</Text>}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter friend's email"
          placeholderTextColor="#aaa"
          value={newFriendEmail}
          onChangeText={setNewFriendEmail}
        />
        <Button title="Send Friend Request" onPress={sendFriendRequest} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#FF0000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Orbitron', // Apply Orbitron font
  },
  profileContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Orbitron', // Apply Orbitron font
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: 'Orbitron', // Apply Orbitron font
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'Orbitron', // Apply Orbitron font
  },
  requestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Orbitron', // Apply Orbitron font
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
    fontFamily: 'Orbitron', // Apply Orbitron font
  },
});

export default Profile;
