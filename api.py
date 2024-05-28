from flask import Flask, request, jsonify
import os
import io
import cv2
import numpy as np
from PIL import Image
import tensorflow as tf
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
from skimage import io as Skio , color,img_as_ubyte
from skimage.feature import graycomatrix, graycoprops, local_binary_pattern
import cv2
import seaborn as sns
from collections import Counter

# loaded_model = tf.keras.models.load_model('models/InceptionV3_Newdateset_Fulldat_metric_bacc/InceptionV3_Newdateset_Fulldat_metric_bacc.keras')
# SVMLoad = pickle.load(open("SVM.sav", 'rb'))
# DTLoad = pickle.load(open("DT.sav", 'rb'))
RFLoad = pickle.load(open("./rf.sav", 'rb'))
# GNBLoad = pickle.load(open("gnb.sav", 'rb'))
# KNNLoad = pickle.load(open("knn.sav", 'rb'))
# MLPLoad = pickle.load(open("MLP.sav", 'rb'))

y_pred = None


def co_occurrence_matrix(image_path, distances=[1, 5, 20], levels=256):
    # Load the image
    # image = io.imread(image_path)
    
    image = image_path
    # Check if the image has an alpha channel; if so, drop it
    if image.shape[-1] == 4:
        image = image[..., :3]  # Keep only the first three channels (RGB)

    # Convert to grayscale if it's a color image
    if len(image.shape) == 3:
        image = color.rgb2gray(image)
        
    # Quantize the image to the specified levels
    image = (image * (levels - 1)).astype(np.uint8)
    
    # Define angles for 0, 45, 90, 135 degrees in radians
    angles = [0, np.pi/4, np.pi/2] 
    # Calculate the GLCM
    glcm = graycomatrix(image, distances=distances, angles=angles, levels=levels, symmetric=True, normed=True)
    return glcm

def calculate_color_histogram(image, bins=256, channel_mask=[True, True, True]):
    # Calculate histograms for each channel
    histograms = []
    for i in range(3):  # Assuming the image has three channels (RGB)
        if channel_mask[i]:
            hist, _ = np.histogram(image[:, :, i], bins=bins, range=(0, 256), density=True)
            histograms.append(hist)
        else:
            histograms.append(np.zeros(bins))  # Append zeros if channel is masked
    return np.concatenate(histograms)

def calculate_texture_features(glcm):
    # Initialize a dictionary to store aggregated features
    features = {

    }
    # Number of directions
    num_directions = glcm.shape[2]
    num_anles = glcm.shape[3]
    
    # Compute features for each direction and average them
    for j in range(num_directions):
        for k in range(num_anles):
            features[f'Contrast_{j}_{k}'] = graycoprops(glcm, 'contrast',)[j, k]
            # features[f'Correlation_{j}_{k}'] = graycoprops(glcm, 'correlation')[j, k]
            # features[f'Energy_{j}_{k}'] = graycoprops(glcm, 'energy')[j, k]
            features[f'Homogeneity_{j}_{k}'] = graycoprops(glcm, 'homogeneity')[j, k]
            # features[f'ASM_{j}_{k}'] = graycoprops(glcm, 'ASM')[j, k]
            features[f'Dissimilarity_{j}_{k}'] = graycoprops(glcm, 'dissimilarity')[j, k]
            entropy = -np.sum(glcm[:, :, j, k] * np.log2(glcm[:, :, j, k] + 1e-10))
            features[f'Entropy_{j}_{k}'] = entropy

    # Average the features over the number of directions
    for key in features:
        features[key] /= num_directions

    return features

def lbglcm_calculator(image_url ,radius = 3  ):
    # image = io.imread(image_url)
    image = image_url
    # Check if the image has an alpha channel; if so, drop it
    if image.shape[-1] == 4:
        image = image[..., :3]  # Keep only the first three channels (RGB
    # Convert to grayscale if it's a color image
    if len(image.shape) == 3:
        image_gray = color.rgb2gray(image)
    else :
        image_gray = image
    
    # image_gray = img_as_ubyte(rgb2gray(image))

    n_points = 8 * radius 

    lbp_image = local_binary_pattern(image_gray, n_points, radius, method="uniform")

    lbglcm = graycomatrix(lbp_image.astype(np.uint8), distances=[1, 5, 20], angles = [0, np.pi/4, np.pi/2] , levels=256)
    return lbglcm

def calculate_texture_features_lbglcm(lbglcm):
    # Initialize a dictionary to store aggregated features
    features = {

    }
    # Number of directions
    num_directions = lbglcm.shape[2]
    num_anles = lbglcm.shape[3]
    
    # Compute features for each direction and average them
    for j in range(num_directions):
        for k in range(num_anles):
            features[f'lbglcm_Contrast_{j}_{k}'] = graycoprops(lbglcm, 'contrast',)[j, k]
            # features[f'lbglcm_Correlation_{j}_{k}'] = graycoprops(lbglcm, 'correlation')[j, k]
            # features[f'lbglcm_Energy_{j}_{k}'] = graycoprops(lbglcm, 'energy')[j, k]
            features[f'lbglcm_Homogeneity_{j}_{k}'] = graycoprops(lbglcm, 'homogeneity')[j, k]
            # features[f'lbglcm_ASM_{j}_{k}'] = graycoprops(lbglcm, 'ASM')[j, k]
            features[f'lbglcm_Dissimilarity_{j}_{k}'] = graycoprops(lbglcm, 'dissimilarity')[j, k]
            entropy = -np.sum(lbglcm[:, :, j, k] * np.log2(lbglcm[:, :, j, k] + 1e-10))
            features[f'lbglcm_Entropy_{j}_{k}'] = entropy

    # Average the features over the number of directions
    for key in features:
        features[key] /= num_directions

    return features



def calculate_glrlm(image, levels=256):
    # Check if image is RGBA, if so, convert to RGB
    if image.shape[-1] == 4:
        image = image[..., :3]  # Discard alpha channel

    # Convert to grayscale if it's a color image
    if len(image.shape) == 3:
        image = color.rgb2gray(image)

    # Ensure the image is in the correct format
    image = img_as_ubyte(image)

    # Initialize the GLRLM matrix
    max_run_length = image.shape[1]  # maximum run length possible is the number of columns
    glrlm = np.zeros((levels, max_run_length), dtype=int)
    
    # Calculate GLRLM
    for i in range(image.shape[0]):  # for each row
        run_length = 0
        previous_value = image[i, 0]
        for j in range(image.shape[1]):  # for each column
            if image[i, j] == previous_value:
                run_length += 1
            else:
                if run_length > 0:
                    glrlm[previous_value, run_length - 1] += 1
                run_length = 1
                previous_value = image[i, j]
        if run_length > 0:
            glrlm[previous_value, run_length - 1] += 1  # For the last run in the row

    return glrlm

def short_runs_emphasis(glrlm):
    # Calculate Short Runs Emphasis
    j = np.arange(1, glrlm.shape[1] + 1)
    denominator = np.sum(glrlm)
    numerator = np.sum(glrlm / j**2, axis=(0, 1))  # sum over both dimensions
    return numerator / denominator if denominator != 0 else 0

def process_image(image_path):
    try:
        # image = io.imread(image_path)

        image = image_path

        if image.shape[-1] == 4:
            image = image[..., :3]

        co_occ = co_occurrence_matrix(image, levels=256)
        lbglcm = lbglcm_calculator(image)
        glrlm = calculate_glrlm(image)
        sre = short_runs_emphasis(glrlm)

        features = calculate_texture_features(co_occ)
        features.update(calculate_texture_features_lbglcm(lbglcm))
        features['short_runs_emphasis'] = sre
        # features['Class'] = os.path.basename(os.path.dirname(image_path))
        return features
    except Exception as e:
        print(f"Failed to process {image_path}: {e}")
        return None
    
def majority_voting(*predictions):
    # Transpose to get predictions for each sample across all models
    predictions = np.array(predictions).T
    final_predictions = []

    for preds in predictions:
        # Count occurrences of each class label
        vote_counts = Counter(preds)
        # Get the most common class label
        final_predictions.append(vote_counts.most_common(1)[0][0])

    return np.array(final_predictions)

app = Flask(__name__)
CORS(app) 

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    print("request.files: ", request.files)
    file = request.files['file']
    print("file: ", file)
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
    # resized_image = cv2.resize(image_rgb, (122, 122))

    # normalized_image = resized_image / 255.0

    # x = np.expand_dims(normalized_image, axis=0)
    # x = preprocess_input(x)
    X = [list(process_image(image_rgb).values())]

    # y_pred = loaded_model.predict(x)
    # print("SVM: ", SVMLoad.predict(X))
    # print("DT: ", DTLoad.predict(X))
    # print("RF: ", RFLoad.predict(X))
    # print("GNB: ", GNBLoad.predict(X))
    # print("KNN: ", KNNLoad.predict(X))
    # print("MLP: ", MLPLoad.predict(X))
    
    # svm_preds = SVMLoad.predict(X)
    # dt_preds = DTLoad.predict(X)
    rf_preds = RFLoad.predict(X)

    # gnb_preds = GNBLoad.predict(X)
    # knn_preds = KNNLoad.predict(X)
    # mlp_preds = MLPLoad.predict(X)

    # print("SVM: ", svm_preds)
    # print("DT: ", dt_preds)
    print("RF: ", rf_preds)
    # print("GNB: ", gnb_preds)
    # print("KNN: ", knn_preds)
    # print("MLP: ", mlp_preds)

    # Perform majority voting
    final_predictions = majority_voting(rf_preds)

    print("Final Predictions: ", final_predictions)
    # result = 'human' if y_pred[-1] > 0.5 else 'ai'

    result = 'human' if final_predictions =='REAL' else 'ai'

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