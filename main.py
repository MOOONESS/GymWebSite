from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import serial
import time

app = FastAPI()

def get_serial_data():
    # Initialize serial connection (adjust settings as per your hardware)
    ser = serial.Serial(
        port='COM3',  # Change to your serial port
        baudrate=115200,
        timeout=0.05  # Short timeout to keep the data flowing quickly
    )
    
    try:
        while True:
            if ser.in_waiting > 0:
                # Read all data waiting in the buffer
                data = ser.read(ser.in_waiting)
                if data:
                    # Format and yield each piece of data as it comes in
                    yield f"data: {data.decode().strip()}\n\n"
            else:
                # Sleep briefly to yield control and prevent a tight loop
                time.sleep(0.05)
    finally:
        ser.close()

@app.get("/events")
async def events():
    return StreamingResponse(get_serial_data(), media_type="text/event-stream")

# uvicorn main:app --reload