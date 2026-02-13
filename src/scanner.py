import cv2
from pyzbar.pyzbar import decode
import numpy as np

def start_robust_scanner():
    # 1. INCREASE RESOLUTION
    # Standard webcams default to 640x480. We force 1280x720 or higher for detail.
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    # 2. CREATE SHARPENING KERNEL
    # This matrix highlights edges (transitions from white to black)
    sharpen_kernel = np.array([[-1,-1,-1], 
                               [-1, 9,-1], 
                               [-1,-1,-1]])

    print("Robust Scanner started. Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret: break

        # --- PRE-PROCESSING PIPELINE ---
        
        # Step A: Convert to Grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
        # Step B: Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
        # This is better than standard global thresholding for uneven lighting
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        contrast_enhanced = clahe.apply(gray)

        # Step C: Sharpen the image
        # This makes the "blur" between bars disappear
        processed_frame = cv2.filter2D(contrast_enhanced, -1, sharpen_kernel)

        # Optional: Binary Threshold (Extreme contrast)
        # Uncomment the next line if lighting is VERY bad, but it can sometimes kill details
        # _, processed_frame = cv2.threshold(processed_frame, 100, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # -------------------------------

        # Pass the PROCESSED frame to the decoder, not the original color one
        decoded_objects = decode(processed_frame)

        # Draw the rectangle on the ORIGINAL frame so the user sees a nice video
        for obj in decoded_objects:
            barcode_data = obj.data.decode("utf-8")
            barcode_type = obj.type
            
            # Draw on the original colorful frame
            points = obj.polygon
            if len(points) == 4:
                pts = np.array(points, dtype=np.int32).reshape((-1, 1, 2))
                cv2.polylines(frame, [pts], True, (0, 255, 0), 3)

            text = f"{barcode_data}"
            cv2.putText(frame, text, (points[0].x, points[0].y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
            print(f"Scanned: {barcode_data}")

        # Show both windows so you can debug the 'view' the computer sees
        cv2.imshow('User View (Original)', frame)
        cv2.imshow('Computer View (Processed)', processed_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    start_robust_scanner()