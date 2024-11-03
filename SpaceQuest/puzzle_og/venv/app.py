import os
import random
from flask import Flask, request, jsonify, render_template
from PIL import Image

app = Flask(__name__)

# set paths for static directories
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')
app.config['PIECES_FOLDER'] = os.path.join('static', 'pieces')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PIECES_FOLDER'], exist_ok=True)

# renders html template
@app.route('/')
def index():
    return render_template('index.html')

#
@app.route('/create_puzzle', methods=['POST'])
def create_puzzle():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided."}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({"error": "No selected file."}), 400

    # Ssave the uploaded image
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
    image_file.save(image_path)

    try:
        # open the image and resize it to a fixed size
        with Image.open(image_path) as img:
            img = img.resize((400, 400))  # Resize to ensure it's 400x400
            img.save(image_path)  # overwrite the uploaded image with the resized one

            rows, cols = 4, 4  # 4x4 pieces
            piece_width = img.width // cols
            piece_height = img.height // rows

            correct_order = []  # Store the correct positions

            # generate square pieces
            for r in range(rows):
                for c in range(cols):
                    # calculate the bounding box
                    left = c * piece_width
                    upper = r * piece_height
                    right = left + piece_width
                    lower = upper + piece_height

                    # crop the image to create a piece
                    piece = img.crop((left, upper, right, lower))
                    piece_filename = f'piece_{r}_{c}.png'
                    piece_path = os.path.join(app.config['PIECES_FOLDER'], piece_filename)
                    piece.save(piece_path)

                    # add the piece URL to the correct order list
                    correct_order.append({
                        'url': os.path.join('static', 'pieces', piece_filename),
                        'row': r,
                        'col': c
                    })

            # randomize pieces for the puzzle
            randomized_order = correct_order.copy()
            random.shuffle(randomized_order)

            # return the randomized pieces and the correct order
            return jsonify({"pieces": [piece['url'] for piece in randomized_order], "correctOrder": correct_order})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
