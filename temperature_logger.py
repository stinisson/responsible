import datetime
import json
from time import sleep
import random
import pymongo

client = pymongo.MongoClient("mongodb://localhost")
db = client.responsible
tempReadings = db.tempReading

sensor_name = 'zuk1-6087db250d7ad41b79664ccc'
# tempReadings.insert_one({'_id': sensor_name, 'temperature': []})

with open('credentials.json') as json_file:
    data = json.load(json_file)
    print('telegramID: ' + data['username'])

# tempReadings.update_one({'_id': sensor_name},
#                         {"$set": {'users': [{'first_name': 'Stinisson', 'telegramID': data['username']}] } } )

while True:
    ct = datetime.datetime.now()
    ts = ct.timestamp()
    randomTemp = random.randint(-25, 60)

    print("Sensor: ", sensor_name)
    print("\nCurrent time:", ct)
    print("Ts: ", ts)
    print("Temp °C: ", randomTemp)
    tempReadings.update_one({'_id': sensor_name}, {'$push': {"temperature": {
        "timestamp": ts,
        "degreesCelsius": randomTemp
    }}})
    sleep(5)
