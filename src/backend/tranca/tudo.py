# -*- coding: utf8 -*-
from Adafruit_CharLCD import Adafruit_CharLCD
import time
import MFRC522
import RPi.GPIO as GPIO
from time import sleep
from cv2 import *
import numpy as np
import os
from pynput.keyboard import Key, Listener
from threading import Timer

lcd = Adafruit_CharLCD(7, 13, 6, 24, 5, 16, 20, 4)

recognizer = face.LBPHFaceRecognizer_create()
recognizer.read('trainer/trainer.yml')
cascadePath = "Cascades/haarcascade_frontalface_default.xml"
faceCascade = CascadeClassifier(cascadePath);

font = FONT_HERSHEY_SIMPLEX

#iniciate id counter
id = 0

# names related to ids: example ==> Marcelo: id=1,  etc
names = ['Unknown', 'Joao Guilherme', 'Joao Marcelo', 'Jan']

pin=19
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)

# UID dos cartões que possuem acesso liberado.
CARTOES_LIBERADOS = {
    'B4:8F:C6:CB:36': 'tag1',
    'E3:E5:68:9A:F4': 'tag2',
    'A4:42:26:5:C5': 'Joao Marcelo',
    '48:F1:74:19:D4': 'Joao Guilherme',
}

SENHAS_LIBERADAS = {
    '1234' : 'Joao Guilherme',
    '6969' : 'Joao Marcelo'
}



flag=0

numPessoa = 0

incorrectCounter = 0

passwordTyped = ''

timer = None
listener = None

def on_press(key):
    global passwordTyped
    try:
        if (str(key) != '<65437>'):
            passwordTyped += key.char
        else:
            passwordTyped += '5'
        lcd.clear()
        printInitialMessage()
        lcd.message('{0}'.format(passwordTyped))
        print('{0}'.format(passwordTyped))
    except AttributeError:
        if key == Key.enter:
            checkPassword()
        elif key == Key.num_lock:
            lcd.clear()
            printInitialMessage()
            lcd.message('{0}'.format(passwordTyped))
        else:
            lcd.clear()
            printInitialMessage()
            lcd.message('Caracter invalido')
            
def stopListener():
    global timer, listener
    timer = Timer(3.0, startListener)
    timer.start()
    listener.stop()

def checkPassword():
    global passwordTyped, incorrectCounter, numPessoa
    
    lcd.clear()
    
    if passwordTyped in SENHAS_LIBERADAS:
        numPessoa = passwordTyped
        reconhecimentoFacial('Senha')
        time.sleep(1)
        incorrectCounter = 0
        printInitialMessage()
    else:
        incorrectCounter += 1
        lcd.message('Acesso negado\n{0} de 3 tentativas'.format(incorrectCounter))
        time.sleep(1)
        
        if (incorrectCounter < 3):
            printInitialMessage()
        else:
            incorrectCounter = 0
            lcd.clear()
            lcd.message('Acesso bloqueado.\nEspere 3 segundos\ne tente de novo.')
            stopListener()
    
    passwordTyped = ''
    
def printInitialMessage():
    lcd.clear()
    lcd.message('Aproxime seu cartao\nou\ndigite senha:\n')
    
def startListener():
    global timer, listener
    if (timer != None):
        timer.cancel()
        
    lcd.clear()
        
    printInitialMessage()
    
    listener = Listener(
        on_press = on_press)
    listener.start()

def reconhecimentoFacial(tipoAcessoPrimario):
    global numPessoa, cam, id
    
    cam = VideoCapture(0)
                    
    lcd.clear()
    lcd.message('Olhe para a camera\nOu aperte backspace')
                    
    # Define min window size to be recognized as a face
    minW = 0.1*cam.get(3)
    minH = 0.1*cam.get(4)
    
    acessosPrimariosLiberados = None
    if tipoAcessoPrimario == 'RfID':
        acessosPrimariosLiberados = CARTOES_LIBERADOS
    else:
        acessosPrimariosLiberados = SENHAS_LIBERADAS
    while True:
        ret, img = cam.read()
        
        gray = cvtColor(img, COLOR_BGR2GRAY)
                        
        faces = faceCascade.detectMultiScale( 
            gray,
            scaleFactor = 1.3,
            minNeighbors = 5,
            minSize = (int(minW), int(minH)),
            )
        
        for(x,y,w,h) in faces:
             rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2)
             id, confidence = recognizer.predict(gray[y:y+h,x:x+w])

             # Check if confidence is less them 100 ==> "0" is perfect match 
             if (confidence < 100):
                if (confidence < 74):
                    id = names[id]
                    confidence = "  {0}%".format(round(100 - confidence))
                        
                    if (id == acessosPrimariosLiberados[numPessoa]):
                        putText(img, str(id), (x+5,y-5), font, 1, (255,255,255), 2)
                        putText(img, str(confidence), (x+5,y+h-5), font, 1, (255,255,0), 1)
                        print(id)
                        lcd.clear()
                        lcd.message('Ola, ' + id)
                          
                        cam.release()
                        destroyAllWindows()  
                        return
                else:
                    id = names[0]
                    confidence = "  {0}%".format(round(100 - confidence))
                                    
             else:
                 id = names[0]
                 confidence = "  {0}%".format(round(100 - confidence))
                            
             if (id != names[0]):
                lcd.clear()
                lcd.message("Rosto desconhecido")
                break
                            
             putText(img, str(id), (x+5,y-5), font, 1, (255,255,255), 2)
             putText(img, str(confidence), (x+5,y+h-5), font, 1, (255,255,0), 1)  
                    
        imshow("camera",img) 

        k = waitKey(10) & 0xff # Press 'backspace' for exiting video
        if k == 8:
            lcd.clear()
            lcd.message("Saindo da validacao\nde dois passos")
            sleep(1.5)
            break
        
    cam.release()
    destroyAllWindows()
    
try:
    # Inicia o módulo RC522.
    LeitorRFID = MFRC522.MFRC522()
    startListener()
    
    while True:
        # Verifica se existe uma tag próxima do módulo.
        status, tag_type = LeitorRFID.MFRC522_Request(LeitorRFID.PICC_REQIDL)
        if (status == LeitorRFID.MI_OK and flag==0):
            
            lcd.clear()
            lcd.message('Cartao detectado!')
            flag=1
            # Efetua leitura do UID do cartão.
            status, uid = LeitorRFID.MFRC522_Anticoll()
 
            if status == LeitorRFID.MI_OK:
                uid = ':'.join(['%X' % x for x in uid])
                lcd.clear()
                lcd.message('UID do cartao: %s' % uid)
                
                
                # Se o cartão está liberado exibe mensagem de boas vindas.
                if uid in CARTOES_LIBERADOS:
                    numPessoa = uid
                    p = GPIO.PWM(pin, 1024)
                    p.start(99)
                    sleep(1)
                    p.stop()
                    
                    reconhecimentoFacial('RfID')
                        
                    
                else:
                    lcd.clear()
                    lcd.message('Acesso negado!')
                 
                time.sleep(1)
                printInitialMessage()
                
        elif(status == LeitorRFID.MI_ERR and flag==1):
            flag = 0
            time.sleep(5)
            
        time.sleep(2)


except KeyboardInterrupt:
    # Se o usuário precionar Ctrl + C
    # encerra o programa.
    #GPIO.cleanup()
    print('Programa encerrado.')