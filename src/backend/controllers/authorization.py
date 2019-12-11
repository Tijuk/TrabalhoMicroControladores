from mongo import DB

class Authorization:
	def __init__(self):
		self.__connection = DB.connect("authorization")
	
	def logIn(self, user):
		token = self.__connection.create(uuid = True, user_id = user["uuid"])['uuid']
		print(f"TOKEN: {token}")
		return token
	
	def logOut(self, token):
		self.__connection.delete(uuid = token)
		
	def guard(self, user):
		self.__connection.show_one(user_id = user["uuid"])