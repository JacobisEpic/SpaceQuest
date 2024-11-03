def handleWriteToDatabase(requestData):
    
    write_text_to_file(requestData['imageContents'], requestData['dataBase'])    
    return "data written"


def handleReadFromDatabase(database):
    picture_string = read_text_from_file(database)
    
    return picture_string


def write_text_to_file(text, filename = "wrongPlace.txt"):
    
    print(filename)
    print("entered the write_text_to_file function and writing a text now")

    try:
        with open(filename, 'w') as file:  # Open the file in append mode
            file.write(text)  # Write the text followed by a newline
        print(f"Text written to {filename} successfully.")
    except Exception as e:
        print(f"An error occurred while writing to the file: {e}")


def read_text_from_file(filename="./database/content.txt"):
    print("Entered the read_text_from_file function and reading text now")

    try:
        with open(filename, 'r') as file:  # Open the file in read mode
            contents = file.read()  # Read the entire file contents
        print(f"Text read from {filename} successfully.")
        return contents  # Return the contents of the file
    except Exception as e:
        print(f"An error occurred while reading from the file: {e}")
        return None  # Return None in case of an error

