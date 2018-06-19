
from RPi import GPIO
import Adafruit_DHT
import time


def temp_readout():

    humidity, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 4)
    humidity = round(humidity, 2)
    temperature = round(temperature, 2)
    temp_dict = {}
    if humidity is not None and temperature is not None:
        if humidity > 100:
            humidity, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 4)
        else:
            temp_dict["temperature"] = temperature
            temp_dict["humidity"] = humidity
    else:
      print("Kan de sensor niet uitlezen!")
    print("Meting")
    return temp_dict

temp_readout()






