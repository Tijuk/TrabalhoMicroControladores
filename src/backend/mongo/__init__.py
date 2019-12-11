from pymongo import MongoClient as mongo
from datetime import datetime
from helper import get_timestamp, validate_dict
from uuid import uuid4

DB_ACESSO = "acesso"

ASCENDING = 1
DESCENDING = -1

class MockConnection:
	def __init__(self):
		self.__db = []

	def find_one(self, **args):
		for entry in self.__db:
			all_equal = True
			for key in args:
				if all_equal:
					if key in entry:
						all_equal = entry[key] == args[key]
					else:
						all_equal = False
			if all_equal:
				return entry
		return None
		


	def insert(self, **entry):
		self.__db.append(args)




class DBConnection:
	def __init__(self, con, output = print):
		self.__con = con
		self.__ouput = output
		
		
	def create(self, uuid = True, timestamp = True, **entry):
		"""
			Cria uma entrada na tabela
		
			Basta chamar:
			db.create(nome = "Fulano", uuid = True, timestamp = True, ...)
		
		"""
		self.__checkConnection()
		if uuid:
			entry["uuid"] = str(uuid4())
			
		if timestamp:
			entry["timestamp"] = get_timestamp()
			
		self.__con.insert(entry)
		self.__ouput("[" + str(entry) + "] foi inserido no banco com sucesso")
		return entry
	
	def show_one(self, entr = None, **entry):  # show
		"""
			Procura uma entrada na tabela
		
			entry pode ser:
			- uma string, e então será procurado por alguma entrada que tenha o [uuid] igual a essa string
			- uma tuple, e então será montado um dicionário em que o primeiro elemento da tuple será a chave e o segundo o valor
			- um dicionário, e então será enviado para busca
		
		"""
		self.__checkConnection()
		found = self.__con.find_one(entry)
		if found is not None:
			self.__ouput("[" + str(found) + "] foi carregado com sucesso")
		else:
			self.__ouput("[" + str(entry) + "] não foi encontrado")
		return found
	
	def show_many(self, *sort, **entry):  # index
		self.__checkConnection()
		found = None
		if len(sort) > 0:
			found = self.__con.find(entry, sort = sort)
		else :
			found = self.__con.find(entry)
		self.__ouput("[" + str(entry) + "] foram carregados com sucesso")
		if found is not None:
			return list(found)
		return list()
	
	def delete(self, **entry):
		self.__checkConnection()
		self.__con.delete_one(entry)
		self.__ouput("[" + str(entry) + "] foram carregados com sucesso")
	
	def update(self, old, **entry):
		self.__checkConnection()
		r_old = self.__resolveEntry(old)
		
		self.__con.update_one(old, entry)
		self.__ouput("[" + str(old) + "] foi atualizado com sucesso")
		return self.show_one(uuid = entry['uuid'])
		
	def __resolveEntry(self, entry):
		"""
			entry pode ser:
	- uma string, e então será procurado por alguma entrada que tenha o [uuid] igual a essa string
	- uma tuple, e então será montado um dicionário em que o primeiro elemento da tuple será a chave e o segundo o valor
	- um dicionário, e então será enviado para busca
		
		"""
		resolved = {}
		if type(entry) == str:
			resolved["uuid"] = entry
		elif type(entry) == tuple:
			key,value = entry
			resolved[key] = value
		elif type(entry) == dict:
			resolved = entry
		else:
			raise TypeError("[" + type(entry) + "] não é um tipo suportado pela conexão")
		return resolved1

	def __checkConnection(self):
		if self.__con is None:
			raise ConnectionError("Não existe uma conexão ativa com o banco de dados")

class DB:
	_client = None

	@staticmethod	
	def start(uri = "localhost", port = 27017):
		DB._client = mongo(uri, port)
		pass
	
	@staticmethod	
	def connect(dbID = DB_ACESSO, **kwargs):
		DB.checkConnection()
		# return DBConnection(MockConnection(), **kwargs)
		return DBConnection(DB._client["Micro"][dbID], **kwargs)
	  
	@staticmethod		
	def checkConnection():
		if DB._client is None:
			print("Você precisa chamar DB.start antes")
			raise ConnectionError("Não existe uma conexão ativa com o Cliente")
