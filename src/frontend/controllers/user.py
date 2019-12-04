import DB

class User:
    def __init__(self):
        self.connection = DB.connect("")
    
    def create(self, user):
        # check dictionary keys
        connection.create(timestamp = False, name = user["name"], rfId = user["rfId"], pictures = user["pictures"], password = user["password"])
    
    def get(self, user):
        connection.show_one(uuid = user["uuid"])
    
    def update(self, user):
        # check dictionary keys
        connection.update(name = user["name"], rfId = user["rfId"], pictures = user["pictures"], password = user["password"])
    
    def delete(self, user):
        connection.delete(uuid = user["uuid"])