from pynput.keyboard import Key, Listener

correctPassword = '1234'
passwordTyped = ''

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

def checkPassword():
    global passwordTyped
    
    if passwordTyped == correctPassword:
        print('Access granted')
    else:
        print('Access denied')
        print('Type the password [hit Enter when ends]: ')
    
    passwordTyped = ''
            
    
with Listener(
    on_press = on_press) as listener:
    print('Type the password [hit Enter when ends]: ')
    listener.join()