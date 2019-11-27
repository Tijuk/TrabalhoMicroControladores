import cv2
import numpy as np
import os
import time
import RPi.GPIO as GPIO
import MFRC522

usuario

#facial
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read('trainer/trainer.yml')
cascadePath = "Cascades/haarcascade_frontalface_default.xml"
faceCascade = cv2.CascadeClassifier(cascadePath);

font = cv2.FONT_HERSHEY_SIMPLEX

#iniciate id counter
id = 0
k = 0

# names related to ids: example ==> Marcelo: id=1,  etc
names = ['Unknown', 'Joao Guilherme', 'Joao Marcelo', 'Jan']

# Define min window size to be recognized as a face
minW = 0.1*cam.get(3)
minH = 0.1*cam.get(4)

#RFID
# UID dos cartões que possuem acesso liberado.
CARTOES_LIBERADOS = {
    'B4:8F:C6:CB:36': 'tag1',
    'E3:E5:68:9A:F4': 'tag2',
    'A4:42:26:5:C5': 'Cartãozinho',
    '48:F1:74:19:D4': 'Joao',
}
flag=0
# Inicia o módulo RC522.
LeitorRFID = MFRC522.MFRC522()
     
print('Aproxime seu cartão RFID')

while True:
    # Verifica se existe uma tag próxima do módulo.
    status, tag_type = LeitorRFID.MFRC522_Request(LeitorRFID.PICC_REQIDL)
 
    if (status == LeitorRFID.MI_OK and flag==0):
        print('Cartão detectado!')
        flag=1
        # Efetua leitura do UID do cartão.
        status, uid = LeitorRFID.MFRC522_Anticoll()
 
        if status == LeitorRFID.MI_OK:
            uid = ':'.join(['%X' % x for x in uid])
            print('UID do cartão: %s' % uid)
                
            #LeitorRFID.MFRC522_Write(0,[1])
     
            # Se o cartão está liberado exibe mensagem de boas vindas.
            if uid in CARTOES_LIBERADOS:
                print('Cartao Liberado')
                print('Olá %s.' % CARTOES_LIBERADOS[uid])
                
                # Initialize and start realtime video capture
                cam = cv2.VideoCapture(0)
                
                while True:
                    ret, img =cam.read()
                    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
                    
                    faces = faceCascade.detectMultiScale( 
                        gray,
                        scaleFactor = 1.3,
                        minNeighbors = 5,
                        minSize = (int(minW), int(minH)),
                       )

                    for(x,y,w,h) in faces:
                        cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2)
                        id, confidence = recognizer.predict(gray[y:y+h,x:x+w])

                        # Check if confidence is less them 100 ==> "0" is perfect match 
                        if (confidence < 100):
                            if (confidence < 74):
                                id = names[id]
                                confidence = "  {0}%".format(round(100 - confidence))
                            else
                                id = names[0]
                                confidence = "  {0}%".format(round(100 - confidence))
                        else:
                            id = names[0]
                            confidence = "  {0}%".format(round(100 - confidence))
                        
                        #compara
                        if (id == CARTOES_LIBERADOS[uid]):
                            usuario = id
                            print('olha que coisa mais linda, mais cheia de graça')
                            k = 27
                        
                        cv2.putText(img, str(id), (x+5,y-5), font, 1, (255,255,255), 2)
                        cv2.putText(img, str(confidence), (x+5,y+h-5), font, 1, (255,255,0), 1)
                    
                    cv2.imshow('camera',img) 

                    #k = cv2.waitKey(10) & 0xff # Press 'ESC' for exiting video
                    if k == 27:
                        break
                    print("\n [INFO] Exiting Program and cleanup stuff")
                    
                cam.release()
                cv2.destroyAllWindows()

                
            else:
                print('Acesso Negado!')
 
            print('\n')
            print('Aproxime seu cartão RFID')
            print('\n')
                
    elif(status == LeitorRFID.MI_ERR and flag==1):
        flag = 0
            
    time.sleep(2)

