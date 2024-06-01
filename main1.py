from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import serial
import time
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_serial_data():
    # Initialize serial connection (adjust settings as per your hardware)
    ser = serial.Serial(
        port='COM3',  # Change to your serial port
        baudrate=115200,
        timeout=0.15  # Short timeout to keep the data flowing quickly
    )
    
    last_sent = None  # Variable to store the last sent value
    try:
        while True:
            if ser.in_waiting > 0:
                # Read all data waiting in the buffer
                data = ser.read(ser.in_waiting)
                if data:
                    # Decode and strip data
                    current_value = data.decode().strip()
                    # Send data only if it has changed
                    if current_value != last_sent:
                        last_sent = current_value  # Update the last sent value
                        yield f"data: {current_value}\n\n"
            else:
                # Sleep briefly to yield control and prevent a tight loop
                time.sleep(0.15)
    finally:
        ser.close()


@app.get("/events")
async def events():
    return StreamingResponse(get_serial_data(), media_type="text/event-stream")

if __name__ == "_main_":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)