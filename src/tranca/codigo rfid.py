# -*- coding: utf8 -*-
 
import time
import RPi.GPIO as GPIO
import MFRC522

# UID dos cartões que possuem acesso liberado.
CARTOES_LIBERADOS = {
    'B4:8F:C6:CB:36': 'tag1',
    'E3:E5:68:9A:F4': 'tag2',
    'A4:42:26:5:C5': 'Cartãozinho',
    '48:F1:74:19:D4': 'Joao',
}
flag=0
try:
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
                    print('Acesso Liberado!')
                    print('Olá %s.' % CARTOES_LIBERADOS[uid])
                else:
                    print('Acesso Negado!')
 
                print('\n')
                print('Aproxime seu cartão RFID')
                print('\n')
                
        elif(status == LeitorRFID.MI_ERR and flag==1):
            flag = 0
            
        time.sleep(2)
except KeyboardInterrupt:
    # Se o usuário precionar Ctrl + C
    # encerra o programa.
    GPIO.cleanup()
    print('Programa encerrado.')