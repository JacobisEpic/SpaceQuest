
async function sendPicture() {
    // Grab the value from the input box
    const pictureInput = document.getElementById('name').value;

    const data = {
        imageContents: pictureInput,
        dataBase: "./database/content.txt",
    };

    console.log(data)

    try {
        console.log("Next call is the database")

        const response = await fetch('http://127.0.0.1:5003/writeToDatabase', {
            method: 'POST', // Change the method to POST
            headers: {
                'Content-Type': 'application/json', // Indicate that we're sending JSON data
            },
            body: JSON.stringify(data), // Convert the data object to a JSON string
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}


async function sendResponse(IDLable, databasePath) {
    // Grab the value from the input box
    const pictureInput = document.getElementById(IDLable).value;

    const data = {
        imageContents: pictureInput,
        dataBase: databasePath,
    };

    try {
        console.log("Next call is the database")

        const response = await fetch('http://127.0.0.1:5003/writeToDatabase', {
            method: 'POST', // Change the method to POST
            headers: {
                'Content-Type': 'application/json', // Indicate that we're sending JSON data
            },
            body: JSON.stringify(data), // Convert the data object to a JSON string
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}



    




    
