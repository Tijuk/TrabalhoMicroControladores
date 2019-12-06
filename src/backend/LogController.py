from mongo import DB, ASCEDING, DESCENDING
from helper import get_timestamp, debug, validate_dict

chalk = debug.chalk

class LOG:
	#				0				1			   2	   3	  4
	# 			message_key   , withTimestamp, withUser, 2-way, colors
	USER_CREATED = [("user", "created") , True , True, 2 , [chalk.blue] ]
	USER_UPDATED = [("user", "updated") , True , True, 2 , [chalk.blue] ]
	USER_DELETED = [("user", "deleted") , True , True, 2 , None ]
	USER_FETCHED = [("user", "fetched") , True , True, 1 , None ]
	
	ACESS_ENTER = [("acesso", "entered") , True , True, 2 , [chalk.blue] ]
	ACESS_FAIL = [("acesso", "failed") , True , True, 2 , [chalk.blue, chalk.red, chalk.red] ]
	ACESS_BLOCK = [("acesso", "blocked") , True , True, 2 , [chalk.red] ]
	
	AUTH_LOGIN = [("auth", "login"), True , True, 2 , None ]
	AUTH_LOGOUT = [("auth", "logout"), True , True, 2 , None ]	


class LogController:
	log_formats = {
		"user": {
			"created": "{} foi criado com valores {}",
			"updated": "{} foi editado, novos valores {}",
			"deleted": "{} foi deletado",
			"fetched": "{} foi carregado"
		},
		"acesso": {
			"entered": "{} entrou utilizando {}",
			"failed": "{} tentou entrar utilizando {} mas {}. Tentativa {}",
			"blocked": "{} foi {}"
		},
		"auth": {
			"logIn": "{} realizou log in",
			"logOut": "{} realizou log out"
		}
	}
	
	def __init__(self):
		self.con = DB.connect("log")
	
	def __format(self,colorize, fmt, styles, values):
		string = ""
		vs = []
		if colorize:
			vs = [styles[i](values[i]) for i in range(0, values)]
		else:
			vs = values
		return fmt.format(*values)
		
	
	def __write(self, fmt_arg, user_id = None, *args):
		main_key, sub_key = fmt_arg[0]
		fmt = log_formats[main_key][sub_key]
		styles = fmt_arg[4]
		outs = fmt_arg[3]
		withTimeStamp = fmt_arg[1]
		withUser = fmt_arg[2]
		
		values = []
		styles = []
		if withTimeStamp:
			values.append(get_timestamp() + ": ")
			styles.append(chalk.cyan)
		if withUser:
			values.append("Usuario ")
			styles.append(chalk.cyan)
		values = values + args
		styles = styles + styles
	
		if outs >= 1:
			print(self.__format(True, fmt, styles, values))
		if outs >= 2:
			self.con.create( uuid = False, user_id = user_id, message = self.__format(False, fmt, styles, values))
	
	def write(self, log_format, user = None, *args):
			stringied = [ user["name"] ]
			self.__write(log_format, user["uuid"] if user is not None else None, *stringified)
					
		
	def get_all(self, date_start = None, date_end = None):
		sort = []
		if date_start is not None:
			
		
		
