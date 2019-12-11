import os


class Resolver:
	
	base = os.path.join("..", "..", "data")
	
	def face_recognition(self, name):
		return os.path.join(Resolver.base, "face_recognition", name)
		
		
