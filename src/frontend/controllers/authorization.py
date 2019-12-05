import DB

class Authorization:
    def __init__(self):
        self.connection = DB.connect("")
    
    def logIn(self, user):
        connection.create(user_id = user["uuid"])
    
    def logOut(self, user):
        connection.delete(user_id = user["uuid"])
        
    def guard(self, user):
        connection.show_one(user_id = user["uuid"])