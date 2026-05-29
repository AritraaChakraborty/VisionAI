import cv2
import base64
import asyncio
import time
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from ultralytics import YOLO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading VisionAI YOLO Model...")
model = YOLO('yolov8n.pt') 

@app.websocket("/ws/stream")
async def video_stream(websocket: WebSocket):
    await websocket.accept()
    cap = cv2.VideoCapture(0) 

    # --- HACKATHON DEMO TRACKERS ---
    class_timers = {}       
    reported_alerts = set() 

    try:
        while True:
            success, frame = cap.read()
            if not success:
                break

            height, width, _ = frame.shape
            results = model.track(frame, persist=True, verbose=False)
            
            detected_boxes = []
            new_alerts = []
            current_time = time.time()

            if results[0].boxes is not None:
                for box in results[0].boxes:
                    if box.id is None:
                        continue
                        
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    class_id = int(box.cls[0].item())
                    confidence = round(box.conf[0].item(), 2)
                    
                    if confidence < 0.45:
                        continue
                        
                    class_name = model.names[class_id]
                    obj_id = int(box.id[0].item())
                    
                    # 🚨 DEMO FIX: Start the timer and NEVER reset it



                        if class_name != "person":

        if obj_id not in class_timers:
            class_timers[obj_id] = current_time

        time_present = current_time - class_timers[obj_id]

        if obj_id not in reported_alerts:
            print(f"Tracking {class_name} ID:{obj_id} -> {time_present:.1f}s")

        if time_present >= 1 and obj_id not in reported_alerts:

            alert_time = time.strftime("%H:%M:%S")

            print(f"🚨 ALERT: Unauthorized {class_name}")

            new_alerts.append({
                "id": int(current_time * 1000),
                "level": "red",
                "title": "Unauthorized Object",
                "zone": f"{class_name.capitalize()} detected",
                "time": alert_time
            })

            reported_alerts.add(obj_id)




                    # UI Coordinates
                    left_pct = (x1 / width) * 100
                    top_pct = (y1 / height) * 100
                    width_pct = ((x2 - x1) / width) * 100
                    height_pct = ((y2 - y1) / height) * 100
                    
                    if class_name == "person": tone = "cyan"
                    elif class_name in ["car", "truck", "motorcycle", "bus", "bicycle"]: tone = "red"
                    else: tone = "yellow"
                        
                    detected_boxes.append({
                        "x": f"{left_pct}%",
                        "y": f"{top_pct}%",
                        "w": f"{width_pct}%",
                        "h": f"{height_pct}%",
                        "label": f"ID:{obj_id} {class_name.capitalize()} · {confidence}",
                        "tone": tone
                    })

            # 🚨 Note: The "cleanup" block was intentionally deleted! 
            # The timer will no longer reset if the camera blinks.

            _, buffer = cv2.imencode('.jpg', frame)
            jpg_as_text = base64.b64encode(buffer).decode('utf-8')

            await websocket.send_json({
                "image": jpg_as_text,
                "boxes": detected_boxes,
                "new_alerts": new_alerts
            })
            
            await asyncio.sleep(0.03) 
            
    except Exception as e:
        print(f"Connection closed: {e}")
    finally:
        cap.release()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
