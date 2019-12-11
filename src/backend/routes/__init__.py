from flask import Flask, request
from bson.json_util import dumps, loads
from controllers import UserController, AuthController
import sys
import logging
logging.basicConfig(level=logging.DEBUG)

def show(args):
	sys.stdout.write(str(args) + "\n")

def serialize(data = {}, status = 200, message = ""):
	return { "data": data, "status": status, "message": message }

def user_resource(user):
	return {
		"name": user["name"],
		"uuid": user["uuid"],
		"rfid": user["rfid"]
	}

def get_app(name):
	app = Flask(__name__)

	# ------- AUTH ROUTES
	@app.route('/auth/login', methods=['POST'])
	def auth_login():
		data = request.get_json()
		user = UserController.byNamePass(name = data["name"], password = data["password"])
		# return user
		if user is not None:
			token = AuthController.logIn(user)
			return serialize(data = {"token": str(token),  "user": user_resource(user)}, status= 200, message = "Usuario logado com sucesso")
		else:
			return serialize(status= 422, message = "Senha incorreta")


	@app.route('/auth/logout', methods=['POST'])
	def auth_logout():
		user_uuid = request.headers.get('Authorization')
		return serialize(data = dict(request.headers), message = "Usuario deslogado com sucesso")

	# ------- USER ROUTES
	@app.route('/users/create', methods=['POST'])
	def user_create():
		try:
			user = UserController.create(request.get_json())
			return serialize(data = user_resource(user), message = "Usuario criado com sucesso")
		except Exception as exp:
			return serialize(data = str(exp), status = 500, message = "Falha ao criar Usuário")


	@app.route('/log_access/get_them_all', methods = ['POST'])
	def log_get_them_all():
		data = request.get_json()
		logs = [{ "uuid" : "ahahaha"}]
		return serialize(data = logs, message = "Logs criados com sucesso")

	return app