import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, PanResponder, TouchableOpacity } from 'react-native';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';

const PuzzleGame = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [pieces, setPieces] = useState([]);
    const [positions, setPositions] = useState([]);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const rows = 4;
    const cols = 4;
    const pieceSize = 100;
    const navigation = useNavigation();

    useEffect(() => {
        loadFonts();
        fetchImageUrl();
    }, []);

    const loadFonts = async () => {
        await Font.loadAsync({
            Orbitron: require('../../assets/fonts/Orbitron-VariableFont_wght.ttf'), // Ensure the path is correct
        });
        setFontsLoaded(true);
    };

    const fetchImageUrl = () => {
        const storage = getStorage();
        const imageRef = ref(storage, 'gs://spacequest-9a55d.firebasestorage.app/puzzle.jpg');

        getDownloadURL(imageRef)
            .then((url) => {
                setImageUrl(url);
                createPuzzle();
            })
            .catch((error) => {
                console.error('Error getting image URL:', error);
            });
    };

    const createPuzzle = () => {
        const piecesArray = [];
        const initialPositions = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                piecesArray.push({ row, col });
                initialPositions.push({ x: col * pieceSize, y: row * pieceSize });
            }
        }

        const shuffledPieces = piecesArray.sort(() => Math.random() - 0.5);
        setPieces(shuffledPieces);
        setPositions(initialPositions);
    };

    const handlePanResponderMove = (dx, dy, index) => {
        const updatedPositions = [...positions];
        updatedPositions[index] = {
            x: updatedPositions[index].x + dx,
            y: updatedPositions[index].y + dy,
        };
        setPositions(updatedPositions);
    };

    const handlePanResponderRelease = (index) => {
        const updatedPositions = [...positions];
        const targetRow = Math.round(updatedPositions[index].y / pieceSize);
        const targetCol = Math.round(updatedPositions[index].x / pieceSize);

        const snappedX = targetCol * pieceSize;
        const snappedY = targetRow * pieceSize;

        updatedPositions[index] = { x: snappedX, y: snappedY };
        setPositions(updatedPositions);
    };

    const panResponder = (index) => {
        return PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                const { dx, dy } = gestureState;
                handlePanResponderMove(dx, dy, index);
            },
            onPanResponderRelease: () => {
                handlePanResponderRelease(index);
            },
        });
    };

    const checkPuzzleCompletion = () => {
        let isComplete = true;

        pieces.forEach((piece, index) => {
            const expectedX = piece.col * pieceSize;
            const expectedY = piece.row * pieceSize;
            const posX = positions[index].x;
            const posY = positions[index].y;

            if (Math.abs(posX - expectedX) > 10 || Math.abs(posY - expectedY) > 10) {
                isComplete = false;
            }
        });

        alert(isComplete ? 'Puzzle Completed!' : 'Puzzle is not complete yet!');
    };

    if (!fontsLoaded) {
        return null; // Ensure the font is loaded before rendering
    }

    return (
        <ImageBackground source={require('../../assets/space2.jpeg')} style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.header}>
                <Text style={styles.title}>Puzzle Game</Text>
            </View>
            <View style={styles.puzzleContainer}>
                <View style={styles.puzzleOutline} />
                {imageUrl && pieces.map((piece, index) => (
                    <View
                        key={index}
                        style={{
                            width: pieceSize,
                            height: pieceSize,
                            position: 'absolute',
                            left: positions[index].x,
                            top: positions[index].y,
                            backgroundImage: `url(${imageUrl})`,
                            backgroundPosition: `-${piece.col * pieceSize}px -${piece.row * pieceSize}px`,
                            backgroundSize: '400px 400px',
                            borderWidth: 2,
                            borderColor: 'black',
                        }}
                        {...panResponder(index).panHandlers}
                    />
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Check Puzzle" onPress={checkPuzzleCompletion} color="#4CAF50" />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
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
        fontFamily: 'Orbitron',
    },
    header: {
        marginTop: 100,
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 64,
        color: '#FFFFFF',
        fontFamily: 'Orbitron',
    },
    puzzleContainer: {
        width: 400,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    puzzleOutline: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 400,
        height: 400,
        borderWidth: 3,
        borderColor: 'blue',
        opacity: 0.5,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default PuzzleGame;
