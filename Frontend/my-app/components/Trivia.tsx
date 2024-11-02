import React, { useEffect, useState } from 'react';

interface Question {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
}

const Trivia: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrivia = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/trivia');
                if (!response.ok) {
                    throw new Error('Failed to fetch trivia data');
                }
                const data = await response.json();
                setQuestions(data.results);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchTrivia();
    }, []);

    return (
        <div>
            <h1>Trivia Questions</h1>
            {error ? (
                <p>{error}</p>
            ) : (
                questions.map((questionData, index) => (
                    <div key={index} className="question">
                        <p>{index + 1}. {questionData.question}</p>
                        <ul>
                            {[...questionData.incorrect_answers, questionData.correct_answer]
                                .sort()
                                .map((choice, i) => (
                                    <li key={i}>{choice}</li>
                                ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default Trivia;
