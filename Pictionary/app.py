from flask import Flask, render_template, request
from server.handles import handleWriteToDatabase, handleReadFromDatabase

app = Flask(__name__)


# Templates
@app.route('/astronaut')
def astronaut():
    
    
    return render_template('astronaut.html')

@app.route('/user')
def user():
    stringResponseFromDatabase = handleReadFromDatabase()
    return render_template('user.html', picture_string = stringResponseFromDatabase)


#Database Functions
@app.route('/writeToDatabase', methods=['POST'])
def writeToDatabase():
    requestData = request.get_json()  # Get the JSON data from the request body
    handleWriteToDatabase(requestData)
    
    return "Text is written to database"

@app.route('/readFromDatabase')
def readFromDatabase():
    return "text read from database"


if __name__ == '__main__':
    app.run(port=5003, debug=True)