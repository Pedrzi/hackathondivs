import cv2
import numpy as np
from pyzbar.pyzbar import decode
import time
from typing import Optional

class ScannerService:
    def escanear_codigo_localmente(self) -> Optional[str]:
        """
        Abre a câmera do SERVIDOR (backend) para testes.
        Em produção, o frontend enviará a string ou a imagem.
        """
        cap = cv2.VideoCapture(0)
        
        # Configuração para alta resolução
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

        sharpen_kernel = np.array([[-1,-1,-1], [-1, 9,-1], [-1,-1,-1]])
        
        codigo_encontrado = None
        tempo_limite = time.time() + 15 # Tenta por 15 segundos máximo

        try:
            print("📷 Scanner Backend Iniciado (Timeout 15s)...")
            while time.time() < tempo_limite:
                ret, frame = cap.read()
                if not ret:
                    continue

                # Processamento de Imagem
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
                contrast = clahe.apply(gray)
                processed = cv2.filter2D(contrast, -1, sharpen_kernel)

                decoded_objects = decode(processed)

                if decoded_objects:
                    obj = decoded_objects[0]
                    codigo_encontrado = obj.data.decode("utf-8")
                    print(f"✅ Código detectado: {codigo_encontrado}")
                    break
                
                # Pequeno delay para não fritar a CPU
                time.sleep(0.05)
                
        finally:
            cap.release()
            cv2.destroyAllWindows()
            
        return codigo_encontrado