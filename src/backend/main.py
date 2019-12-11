from argparse import ArgumentParser as Parser
from mongo import DB

parser = Parser(description = "Trabalho ede MicroControladores")
parser.add_argument('--hotword', '--h', help= "executa utilizando hotword detection", choices  = ["run", "train"])
parser.add_argument('--facialRecog', '--fr', help = "executa utilizando reconhecimento facial", default = False, action = 'store_true')
parser.add_argument('--server', '--s', help = "executa o servidor", default = False, action = 'store_true')

DB.start()
from routes import get_app

app = get_app(__name__)

app.run()

args = parser.parse_args()

subscription = {}

process_order = ["hotword"]

if args.hotword is not None:
	from hotword import HotwordProcess
	subscription["hotword"] = HotwordProcess(args)
	
if args.facialRecog:
	print("Executa codigo de reconhecimento facial")

if args.server:
	pass


# Faca o "subscription" do processo antes daqui ----------------------------------------------------------


def setup():
	for subscribed in subscription:
		subscribed.setup()

def main():
	while True:
		for subscribed in subscription:
			ret = subscribed.loop()
			if ret:
				break
			
setup()
main()
