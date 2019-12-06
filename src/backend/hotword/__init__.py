import sys

class HotwordProcess:
	def __init__(self, args = {}):
		
		if args.hotword == "run":
			print()
		# Valor da Classe
		self.value = 0
		self.maxIter = 10
	
	def _setup(self):
		print("Inicializando hotword")
				
	def _loop(self):
		self.value = self.value + 1
		print("Iteracao: {} / {}".format(self.value, self.maxIter))
		
		if self.value == 10:
			return True
			
	def _onExit(self):
		print("Removido da iteracao")

