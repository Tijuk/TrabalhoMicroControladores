from mongo import DB
import secrets
import controllers.log as _log
from helper import validate_dict

Log = _log.LogController
LOG = _log.LOG

class User:
	def __init__(self):
		self.__connection = DB.connect("users")

	def __cryptPass(self, password):
		return password
	
	def create(self, user):
		# check dictionary keys
		user["password"] = self.__cryptPass(user["password"])
		created_user = self.__connection.create(timestamp = False, **user)
		Log.write(LOG.USER_CREATED, created_user)
		return created_user

	def byNamePass(self, name, password):
		return self.__connection.show_one(name = name, password = self.__cryptPass(password))
	
	def byUuid(self, uuid):
		return self.__connection.show_one(uuid = uuid)
	
	def update(self, user):
		# check dictionary keys
		return self.__connection.update(**user)
	
	def delete(self, user):
		self.__connection.delete(uuid = user["uuid"])
