import numpy as np
from PIL import Image
import tensorflow as tf
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/vgg16_saved_model.keras')

# Preprocessing for VGG16 (ImageNet)
def load_image(image_path, target_size=(224, 224)):
    img = Image.open(image_path).convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    # VGG16 expects images in BGR order and zero-centered with respect to the ImageNet dataset
    img_array = tf.keras.applications.vgg16.preprocess_input(img_array)
    return img_array

def predict_vgg16_keras(image_path):
    model = tf.keras.models.load_model(MODEL_PATH)
    img = load_image(image_path, target_size=(224, 224))
    preds = model.predict(img)
    probs = tf.nn.softmax(preds, axis=-1).numpy()
    pred_idx = int(np.argmax(probs))
    confidence = float(np.max(probs))
    pred_label = pred_idx  # Replace with label lookup if desired
    return {'class': pred_label, 'confidence': confidence} 