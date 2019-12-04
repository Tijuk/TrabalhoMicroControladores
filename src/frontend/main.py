from argparse import ArgumentParser as Parser
#import src.facialRecognition.recognizer as recognizer

parser = Parser(description = "Trabalho ede MicroControladores")
parser.add_argument('--hotword', '--h', help= "executa utilizando hotword detection", choices  = ["run", "train"])
parser.add_argument('--facialRecog', '--fr', help = "executa utilizando reconhecimento facial", default = False, action = 'store_true')

args = parser.parse_args()

if args.hotword is not None:
    import hotword as hotword
    
if args.facialRecog:
    print("Executa código de reconhecimento facial")

def setup():
    pass

def main():
    setup()
    print("ta sussa")
    while True:
        break
#        if recognizer.loop() == 1:
#            break;
#    recognize.onDestroy()
        
main()
