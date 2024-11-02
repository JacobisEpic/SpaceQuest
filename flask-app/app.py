# from flask import Flask, jsonify

# app = Flask(__name__)

# # Existing "Hello, World!" route
# @app.route('/')
# def home():
#     return jsonify({"message": "Hello, World!"})

# # New Trivia API endpoint
# @app.route('/api/trivia', methods=['GET'])
# def get_trivia():
#     trivia_questions = {
#         "response_code": 0,
#         "results": [
#             {
#                 "type": "multiple",
#                 "difficulty": "medium",
#                 "category": "Entertainment: Film",
#                 "question": "Which actor played the main character in the 1990 film 'Edward Scissorhands'?",
#                 "correct_answer": "Johnny Depp",
#                 "incorrect_answers": ["Clint Eastwood", "Leonardo DiCaprio", "Ben Stiller"]
#             },
#             {
#                 "type": "multiple",
#                 "difficulty": "medium",
#                 "category": "Entertainment: Video Games",
#                 "question": "Which of these is NOT a terrorist faction in Counter-Strike (2000)?",
#                 "correct_answer": "Midwest Militia",
#                 "incorrect_answers": ["Phoenix Connection", "Elite Crew", "Guerrilla Warfare"]
#             }
#             # Add more questions here as needed
#         ]
#     }
#     return jsonify(trivia_questions)

# if __name__ == '__main__':
#     app.run(debug=True)








# from flask import Flask, jsonify, request
# from flask_cors import CORS  # Import CORS
# import requests

# app = Flask(__name__)
# CORS(app)

# # Existing "Hello, World!" route
# @app.route('/')
# def home():
#     return jsonify({"message": "Hello, World!"})

# # New Trivia API endpoint with parameters
# @app.route('/api/trivia', methods=['GET'])
# def get_trivia():
#     # Get parameters from the query string
#     category = request.args.get('category')
#     difficulty = request.args.get('difficulty')
#     question_type = request.args.get('type')  # 'multiple' or 'boolean'
#     amount = request.args.get('amount', 10)  # Default to 10 questions if not provided

#     # EXAMPLE: http://127.0.0.1:5000/api/trivia?amount=5&category=11&difficulty=medium&type=multiple

#     # Prepare the API request to Open Trivia Database
#     opentdb_url = "https://opentdb.com/api.php"
#     params = {
#         "amount": amount,
#         "category": category,
#         "difficulty": difficulty,
#         "type": question_type
#     }

#     # Make the request to Open Trivia Database API
#     response = requests.get(opentdb_url, params=params)

#     # Check if the request was successful
#     if response.status_code == 200:
#         trivia_data = response.json()
#         return jsonify(trivia_data)
#     else:
#         return jsonify({"error": "Failed to retrieve trivia questions"}), 500

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import requests

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable CORS for all origins on /api/* routes

# Existing "Hello, World!" route
@app.route('/')
def home():
    return jsonify({"message": "Hello, World!"})

# New Trivia API endpoint with parameters
@app.route('/api/trivia', methods=['GET'])
def get_trivia():
    # Get parameters from the query string
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    question_type = request.args.get('type')  # 'multiple' or 'boolean'
    amount = request.args.get('amount', 10)  # Default to 10 questions if not provided

    # Prepare the API request to Open Trivia Database
    opentdb_url = "https://opentdb.com/api.php"
    params = {
        "amount": amount,
        "category": category,
        "difficulty": difficulty,
        "type": question_type
    }

    # Make the request to Open Trivia Database API
    response = requests.get(opentdb_url, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        trivia_data = response.json()
        return jsonify(trivia_data)
    else:
        return jsonify({"error": "Failed to retrieve trivia questions"}), 500

if __name__ == '__main__':
    app.run(debug=True)
