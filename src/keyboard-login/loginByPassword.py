from pynput.keyboard import Key, Listener
from threading import Timer

incorrectCounter = 0

correctPassword = '1234'
passwordTyped = ''

timer = None
listener = None

def on_press(key):
    global passwordTyped
    try:
        passwordTyped += key.char
        print('{0}'.format(passwordTyped))
    except AttributeError:
        if key == Key.enter:
            checkPassword()
        else:
            print('Invalid character.')
            
def stopListener():
    global timer, listener
    timer = Timer(3.0, startListener)
    timer.start()
    listener.stop()

def checkPassword():
    global passwordTyped, incorrectCounter
    if passwordTyped == correctPassword:
        print('Access granted')
        incorrectCounter = 0
        printInitialMessage()
    else:
        incorrectCounter += 1
        print('Access denied: {0} of 3'.format(incorrectCounter))
        
        if (incorrectCounter < 3):
            printInitialMessage()
        else:
            incorrectCounter = 0
            print('Access blocked. Wait 3 seconds and try again.')
            stopListener()
    
    passwordTyped = ''
    
def printInitialMessage():
    print('Type the password [hit Enter when ends]: ')
    
def startListener():
    global timer, listener
    if (timer != None):
        timer.cancel()
        
    printInitialMessage()
    
    listener = Listener(
        on_press = on_press)
    listener.start()

startListener()