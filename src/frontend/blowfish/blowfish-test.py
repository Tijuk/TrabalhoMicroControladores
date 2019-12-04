import blowfish
from os import urandom
import binascii

cipher = blowfish.Cipher(b"Key must be between 4 and 56 bytes long.")

initializationVectorSize = 8

password = "87654321"
data = password.encode() # data to encrypt
initializationVector = urandom(initializationVectorSize) # initialization vector

print("Password: " + password)
print("Input Data: " + str(binascii.hexlify(data)))
print("Initialization vector: " + str(binascii.hexlify(initializationVector)))

data_encrypted = b"".join(cipher.encrypt_cbc(data, initializationVector))

print("Data encrypted: " + str(binascii.hexlify(data_encrypted)))

data_decrypted = b"".join(cipher.decrypt_cbc(data_encrypted, initializationVector))

print("Data decrypted: " + str(binascii.hexlify(data_decrypted)))

if (data == data_decrypted):
    print("Input data equals data decrypted")
else:
    print("Input data different data decrypted")