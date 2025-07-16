import numpy as np
from PIL import Image
import tensorflow as tf
tflite = tf.lite
import os

# Path to the TFLite model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/vgg16.tflite')


def load_image(image_path, target_size=(224, 224)):
    img = Image.open(image_path).convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = tf.keras.applications.vgg16.preprocess_input(img_array)
    return img_array

def predict_vgg16(image_path):
    interpreter = tflite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    img = load_image(image_path, target_size=(224, 224))
    interpreter.set_tensor(input_details[0]['index'], img)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    probs = np.exp(output_data) / np.sum(np.exp(output_data))
    pred_idx = int(np.argmax(probs))
    confidence = float(np.max(probs))
    pred_label = pred_idx  # or use a label list
    return {'class': pred_label, 'confidence': confidence} 