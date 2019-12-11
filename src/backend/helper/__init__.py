from helper.fileResolver import Resolver as _Resolver

def get_timestamp():
	from datetime import datetime as dt
	return dt.now().strftime("%Y-%d-%m %H:%M:%S")
	
def validate_dict(the_dict, **keys):
	for key in keys:
		if keys[key] is True:
			if key not in the_dict:
				raise KeyError("Object {} is missing the key {}".format(str(the_dict), key))
		if keys[key] is False:
			if key not in the_dict:
				keys[key] = None
	return the_dict

resolve = _Resolver()
		
