import controllers.authorization as _auth
import controllers.user as _user
import controllers.log as _log

UserController = _user.User()
AuthController = _auth.Authorization()
LogController = _log.LogController()

LOG = _log.LOG