import sys

class HotwordProcess:
	def __init__(self, args = []):
		self._active = False	
		
		# Valor da Classe
		self.value = 0
		self.maxIter = 10
	
	def _setup(self):
		print("Inicializando hotword")
		
		self._active = True
				
	def _loop(self):
		self.value = self.value + 1
		print("Iteracao: {} / {}".format(self.value, self.maxIter))
		
		if self.value == 10:
			return True
			
	def onExit(self):
		print("Removido da iteracao")
