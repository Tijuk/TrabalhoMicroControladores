# -*- coding: utf8 -*-
from Adafruit_CharLCD import Adafruit_CharLCD
import time
import MFRC522
import RPi.GPIO as GPIO
from time import sleep
pin=19
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)

# UID dos cartões que possuem acesso liberado.
CARTOES_LIBERADOS = {
    'B4:8F:C6:CB:36': 'tag1',
    'E3:E5:68:9A:F4': 'tag2',
    'A4:42:26:5:C5': 'Cartaozinho',
    '48:F1:74:19:D4': 'Joao',
}
lcd = Adafruit_CharLCD(7, 13, 6, 24, 5, 16, 20, 4)
flag=0


try:
    # Inicia o módulo RC522.
    LeitorRFID = MFRC522.MFRC522()
    lcd.clear()
    lcd.message('Aproxime seu cartao RFID')
    print('Aproxime seu cartão RFID')
 
    while True:
        # Verifica se existe uma tag próxima do módulo.
        status, tag_type = LeitorRFID.MFRC522_Request(LeitorRFID.PICC_REQIDL)
 
        if (status == LeitorRFID.MI_OK and flag==0):
            
            print('Cartão detectado!')
            lcd.clear()
            lcd.message('Cartao detectado!')
            flag=1
            # Efetua leitura do UID do cartão.
            status, uid = LeitorRFID.MFRC522_Anticoll()
 
            if status == LeitorRFID.MI_OK:
                uid = ':'.join(['%X' % x for x in uid])
                lcd.clear()
                lcd.message('UID do cartao: %s' % uid)
                print('UID do cartão: %s' % uid)
                
                
                # Se o cartão está liberado exibe mensagem de boas vindas.
                if uid in CARTOES_LIBERADOS:
                    print('Acesso Liberado!')
                    lcd.clear()
                    lcd.message('Ola %s.' % CARTOES_LIBERADOS[uid])
                    print('Olá %s.' % CARTOES_LIBERADOS[uid])
                    p = GPIO.PWM(pin, 1024)
                    p.start(99)
                    sleep(0.25)
                    p.stop()
                    
                else:
                    lcd.clear()
                    lcd.message('Acesso negado!')
                    print('Acesso Negado!')
                 
                time.sleep(2)
                lcd.clear()
                lcd.message('Aproxime seu cartao RFID')
                print('\n')
                print('Aproxime seu cartão RFID')
                print('\n')
                
        elif(status == LeitorRFID.MI_ERR and flag==1):
            flag = 0
            
        time.sleep(2)
except KeyboardInterrupt:
    # Se o usuário precionar Ctrl + C
    # encerra o programa.
    #GPIO.cleanup()
    print('Programa encerrado.')