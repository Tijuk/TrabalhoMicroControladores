from pynput.keyboard import Key, Listener
from threading import Timer
from Adafruit_CharLCD import Adafruit_CharLCD
import time

#lcd = Adafruit_CharLCD(2, 3, 4, 5, 6, 7, 16, 2)
lcd = Adafruit_CharLCD(7, 8, 25, 24, 23, 18, 20, 4)

incorrectCounter = 0

correctPassword = '1234'
passwordTyped = ''

timer = None
listener = None

def on_press(key):
    global passwordTyped
    try:
        passwordTyped += key.char
        lcd.clear()
        printInitialMessage()
        lcd.message('{0}'.format(passwordTyped))
    except AttributeError:
        if key == Key.enter:
            checkPassword()
        else:
            lcd.clear()
            printInitialMessage()
            lcd.message('Invalid character.')
            
def stopListener():
    global timer, listener
    timer = Timer(3.0, startListener)
    timer.start()
    listener.stop()

def checkPassword():
    global passwordTyped, incorrectCounter
    
    lcd.clear()
    
    if passwordTyped == correctPassword:
        lcd.message('Access granted')
        time.sleep(1)
        incorrectCounter = 0
        printInitialMessage()
    else:
        incorrectCounter += 1
        lcd.message('Access denied\n{0} of 3 chances'.format(incorrectCounter))
        time.sleep(1)
        
        if (incorrectCounter < 3):
            printInitialMessage()
        else:
            incorrectCounter = 0
            lcd.clear()
            lcd.message('Access blocked.\nWait 3 seconds\nand try again.')
            stopListener()
    
    passwordTyped = ''
    
def printInitialMessage():
    lcd.clear()
    lcd.message('Type the password\nHit Enter when ends: ')
    
def startListener():
    global timer, listener
    if (timer != None):
        timer.cancel()
        
    lcd.clear()
        
    printInitialMessage()
    
    listener = Listener(
        on_press = on_press)
    listener.start()

startListener()