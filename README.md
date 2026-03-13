# ✍️ Handwritten Digit Recognition using CNN

A deep learning project that recognizes handwritten digits (0–9) using a **Convolutional Neural Network (CNN)**.
This project is built using **Python, TensorFlow/Keras**, and trained on the **MNIST dataset**.

---

## 🚀 Overview

Handwritten digit recognition is a classic computer vision problem where the model learns patterns from handwritten images and predicts the correct digit.
In this project, a CNN model is used because it performs well on image-based tasks by automatically learning spatial features like edges, shapes, and textures.

---

## 🧠 Tech Stack

* **Language:** Python
* **Libraries:** TensorFlow, Keras, NumPy, Matplotlib
* **Dataset:** MNIST Handwritten Digits Dataset

---

## 📂 Dataset

The MNIST dataset contains:

* **60,000 training images**
* **10,000 testing images**
* Each image size: **28 × 28 pixels (grayscale)**
* Classes: digits **0–9**

---

## ⚙️ Model Architecture

The CNN model includes:

* Convolutional Layers (feature extraction)
* ReLU Activation
* MaxPooling Layers (dimensionality reduction)
* Flatten Layer
* Fully Connected (Dense) Layers
* Softmax Output Layer

---

## 🏗️ Project Workflow

1. Load and preprocess dataset
2. Normalize pixel values
3. Build CNN model
4. Train model
5. Evaluate performance
6. Predict custom handwritten digits

---

## ▶️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/rawatmehak/Handwritten-digit-recognition-IBM.git
cd handwritten-digit-recognition
```

Install dependencies:

```bash
pip install tensorflow numpy matplotlib
```

Run the project:

```bash
python api.py
```

---

## 📊 Results

* Achieved high accuracy on MNIST dataset
* Model generalizes well on unseen handwritten digits

(Add your exact accuracy here if available)

---

## 📸 Sample Output

The model predicts digits from handwritten input images with high confidence.




---

## 🔮 Future Improvements

* Improve accuracy using deeper CNN
* Add GUI for drawing digits
* Deploy using Flask/Streamlit

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

This project is open-source and available under the MIT License.

