
async function sendPicture() {
    // Grab the value from the input box
    const pictureInput = document.getElementById('name').value;
    
    // // Display the input value (you can also handle it in other ways)
    console.log("writing the input to a database:", pictureInput);

    const data = {
        imageContents: pictureInput,
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



    
