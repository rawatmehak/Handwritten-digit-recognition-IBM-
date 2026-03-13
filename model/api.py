


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