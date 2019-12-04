from argparse import ArgumentParser as Parser

parser = Parser(description = "Trabalho ede MicroControladores")
parser.add_argument('--hotword', '--h', help= "executa utilizando hotword detection", choices  = ["run", "train"])
parser.add_argument('--facialRecog', '--fr', help = "executa utilizando reconhecimento facial", default = False, action = 'store_true')

args = parser.parse_args()

subscription = {}

if args.hotword is not None:
    from hotword import HotwordProcess
    subscription["hotword"] = HotwordProcess(args)
    
if args.facialRecog:
    print("Executa código de reconhecimento facial")


# Faca o "subscription" do processo antes daqui ----------------------------------------------------------

def setup():
    for subscribed in subcription:
        subscribed.setup()

def main():
    while True:
        for subscribed in subcription:
            subscribed.loop()

setup()
main()
