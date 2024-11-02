from flask import Flask, jsonify

app = Flask(__name__)

# Existing "Hello, World!" route
@app.route('/')
def home():
    return jsonify({"message": "Hello, World!"})

# New Trivia API endpoint
@app.route('/api/trivia', methods=['GET'])
def get_trivia():
    trivia_questions = {
        "response_code": 0,
        "results": [
            {
                "type": "multiple",
                "difficulty": "medium",
                "category": "Entertainment: Film",
                "question": "Which actor played the main character in the 1990 film 'Edward Scissorhands'?",
                "correct_answer": "Johnny Depp",
                "incorrect_answers": ["Clint Eastwood", "Leonardo DiCaprio", "Ben Stiller"]
            },
            {
                "type": "multiple",
                "difficulty": "medium",
                "category": "Entertainment: Video Games",
                "question": "Which of these is NOT a terrorist faction in Counter-Strike (2000)?",
                "correct_answer": "Midwest Militia",
                "incorrect_answers": ["Phoenix Connection", "Elite Crew", "Guerrilla Warfare"]
            }
            # Add more questions here as needed
        ]
    }
    return jsonify(trivia_questions)

if __name__ == '__main__':
    app.run(debug=True)
