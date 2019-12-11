import RPi.GPIO as GPIO
from time import sleep
pin=18
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)

p = GPIO.PWM(pin, 528)
p.start(50)
sleep(1)
p.stop()
