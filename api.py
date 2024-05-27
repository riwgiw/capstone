from flask import Flask, request, jsonify
import os
import io
import cv2
import numpy as np
from PIL import Image
import tensorflow as tf
from flask_cors import CORS
loaded_model = tf.keras.models.load_model('models/InceptionV3_Newdateset_Fulldat_metric_bacc/InceptionV3_Newdateset_Fulldat_metric_bacc.keras')
y_pred = None

app = Flask(__name__)
CORS(app) 

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Save the file to a directory (you can specify your own directory)

    # file_path = os.path.join('uploads', file.filename)
    # file.save(file_path)
    in_memory_file = io.BytesIO()
    file.save(in_memory_file)
    data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)
    image_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Resize the image to 122x122 pixels
    resized_image = cv2.resize(image_rgb, (122, 122))

    normalized_image = resized_image / 255.0

    x = np.expand_dims(normalized_image, axis=0)
    # x = preprocess_input(x)
    y_pred = loaded_model.predict(x)
    result = 'human' if y_pred[-1] > 0.5 else 'ai'
    print(result)

    # Mimic Cloudinary response
    response = {
        'url': f'http://localhost:5000/uploads/OK',
        'report': {
            'verdict': result
        },
        'facets': {
            'quality': {
                'is_detected': True
            },
            'nsfw': {
                'is_detected': False
            }
        }
    }
    
    return jsonify(response), 200

@app.route('/reports/image', methods=['POST'])
def analyze_image():
    data = request.json
    image_url = data.get('object')
    print("y",y_pred)


    # Perform your AI analysis here (mocked response for demonstration)
    response = {
        'report': {
            'verdict': 'humman' 
        },
        'facets': {
            'quality': {
                'is_detected': True
            },
            'nsfw': {
                'is_detected': False
            }
        }
    }
    
    return jsonify(response), 200

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)