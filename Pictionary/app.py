from flask import Flask, render_template, request
from server.handles import handleWriteToDatabase, handleReadFromDatabase

app = Flask(__name__)


# Templates
@app.route('/astronaut')
def astronaut():
    stringResponseFromDatabase = handleReadFromDatabase("./database/userResponse.txt")

    return render_template('astronaut.html', userResponse_string = stringResponseFromDatabase)



@app.route('/user')
def user():
    stringResponseFromDatabase = handleReadFromDatabase("./database/content.txt")
    print("The boolean value of the two is: " + str("empty" == stringResponseFromDatabase))
    print(stringResponseFromDatabase)

    return render_template('user.html', picture_string = stringResponseFromDatabase)




#Database Functions
@app.route('/writeToDatabase', methods=['POST'])
def writeToDatabase():
    requestData = request.get_json()  # Get the JSON data from the request body
    
    print(requestData)
    
    handleWriteToDatabase(requestData)
    
    return "Text is written to database"

@app.route('/readFromDatabase')
def readFromDatabase():
    return "text read from database"


if __name__ == '__main__':
    app.run(port=5003, debug=True)