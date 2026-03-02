# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import tensorflow as tf
# import numpy as np
# import cv2
# import os

# # Initialize Flask
# app = Flask(__name__)
# CORS(app)  # Allow React frontend requests

# # Base directory
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# # Load model
# model_path = os.path.join(BASE_DIR, "digit_model.h5")
# model = tf.keras.models.load_model(model_path)

# print("Model Loaded Successfully!")

# # Create uploads folder if not exists
# UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)


# @app.route("/predict", methods=["POST"])
# def predict():

#     if "file" not in request.files:
#         return jsonify({"error": "No file uploaded"}), 400

#     file = request.files["file"]

#     filepath = os.path.join(UPLOAD_FOLDER, file.filename)
#     file.save(filepath)

#     # Load image
#     img = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)

#     if img is None:
#         return jsonify({"error": "Invalid image"}), 400

#     # Preprocessing
#     img = cv2.resize(img, (28, 28))
#     img = 255 - img
#     img = img / 255.0
#     img = img.reshape(1, 28, 28, 1)

#     # Prediction
#     prediction = model.predict(img)
#     digit = int(np.argmax(prediction))
#     confidence = float(np.max(prediction))

#     return jsonify({
#         "prediction": digit,
#         "confidence": confidence
#     })


# if __name__ == "__main__":
#     app.run(debug=True)



from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import os
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "digit_model.h5")
model = tf.keras.models.load_model(model_path)

print("Model Loaded Successfully!")

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    if not data or "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    base64_image = data["image"]

    # Remove header part (data:image/png;base64,...)
    encoded = base64_image.split(",")[1]
    decoded = base64.b64decode(encoded)

    img = Image.open(BytesIO(decoded)).convert("L")
    img = np.array(img)

    # Preprocessing
    img = cv2.resize(img, (28, 28))
    img = img / 255.0
    img = img.reshape(1, 28, 28, 1)

    prediction = model.predict(img)
    digit = int(np.argmax(prediction))
    confidence = float(np.max(prediction) * 100)

    return jsonify({
        "prediction": digit,
        "confidence": confidence
    })

if __name__ == "__main__":
    app.run(debug=True)