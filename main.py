
import src.facialRecognition.recognizer as recognizer

def setup():
    pass

def main():
    setup()
    while True:
        if recognizer.loop() == 1:
            break;
    recognize.onDestroy()
        
main()