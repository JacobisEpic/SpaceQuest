// 'gs://spacequest-9a55d.firebasestorage.app/puzzle.jpg'

import React, { useState, useEffect } from 'react';
import { View, Text, Button, PanResponder } from 'react-native';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const PuzzleGame = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [pieces, setPieces] = useState([]);
    const [positions, setPositions] = useState([]);
    const rows = 4;
    const cols = 4;
    const pieceSize = 100; // Size of each piece

    useEffect(() => {
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
    }, []);

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
        // Calculate nearest grid position
        const targetRow = Math.round(updatedPositions[index].y / pieceSize);
        const targetCol = Math.round(updatedPositions[index].x / pieceSize);

        // Calculate the snapped position
        const snappedX = targetCol * pieceSize;
        const snappedY = targetRow * pieceSize;

        // Update the position of the piece
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

            // Allow for a slight margin of error for completion
            if (Math.abs(posX - expectedX) > 10 || Math.abs(posY - expectedY) > 10) {
                isComplete = false;
            }
        });

        if (isComplete) {
            alert('Puzzle Completed!');
        } else {
            alert('Puzzle is not complete yet!');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Puzzle Game</Text>
            <View style={{ position: 'relative', width: 400, height: 400 }}>
                {/* Outline for the puzzle area */}
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 400,
                    height: 400,
                    borderWidth: 3,
                    borderColor: 'blue', // Color of the outline
                    opacity: 0.5, // Optional: Make the outline semi-transparent
                }} />
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
                            borderStyle: 'solid',
                        }}
                        {...panResponder(index).panHandlers}
                    />
                ))}
            </View>
            <Button title="Check Puzzle" onPress={checkPuzzleCompletion} />
        </View>
    );
};

export default PuzzleGame;

