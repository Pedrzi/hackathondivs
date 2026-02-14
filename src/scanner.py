import cv2
import numpy as np
from pyzbar.pyzbar import decode
from openfoodfacts import API, APIVersion, Country, Environment, Flavor
import time
import json

api = API(
    user_agent="nutrium++",
    username=None,
    password=None,
    country=Country.world,
    flavor=Flavor.off,
    version=APIVersion.v2,
    environment=Environment.org,
)

def scan_barcode_and_return():
    """
    Starts the camera, looks for a barcode, and returns the data string.
    This function blocks (pauses the program) until a barcode is found.
    """
    # 1. Initialize Camera
    cap = cv2.VideoCapture(0)
    
    # Force higher resolution for better detection (Mobile cameras are high res)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

    # 2. Define Sharpening Kernel (for blurry images)
    sharpen_kernel = np.array([[-1,-1,-1], [-1, 9,-1], [-1,-1,-1]])

    print("Camera starting... scanning for barcode...")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                continue

            # --- Image Enhancement Pipeline (No GUI) ---
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
            contrast_enhanced = clahe.apply(gray)
            processed_frame = cv2.filter2D(contrast_enhanced, -1, sharpen_kernel)
            # -------------------------------------------

            # Decode
            decoded_objects = decode(processed_frame)

            if decoded_objects:
                # We found something!
                obj = decoded_objects[0] # Take the first one found
                barcode_data = obj.data.decode("utf-8")
                
                # Cleanup and Return
                cap.release()
                print(f"Success! Barcode found: {barcode_data}")
                return barcode_data

            time.sleep(0.01) 

    except KeyboardInterrupt:
        # Allow user to kill it with Ctrl+C if needed
        cap.release()
        return None


if __name__ == "__main__":
    # For testing purposes, run the scanner directly
    product_id = scan_barcode_and_return()
    print(f"Scanned Product ID: {product_id}")
    api_response = api.product.get(product_id)
    api_response_json = json.dumps(api_response, indent=4)
    with open("product_info.json", "w") as f:
        f.write(api_response_json)