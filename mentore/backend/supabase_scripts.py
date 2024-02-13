import json
import bcrypt
import logging
import random
from datetime import datetime


from database import DATABASE

class SCRIPT:
    def __init__(self, logger):
        self.logger = logger
        self.database = DATABASE(self.logger)
        
        
    def mentors_email_script(self):
        response = self.database.connect()
        if not self.database.connection:
            self.logger.info("Could not connect to the database")
            return
        
        query = response.table("mentors").select("*").execute()
        query = json.loads(query.model_dump_json())['data']               
        
        for record in range(len(query)):
            if query[record]['email'] == None:
                name = query[record]['name']
                email = ''.join([name.replace(' ', '').lower(), '@gmail.com'])
                self.logger.info(email)
                response.table('mentors').update({'email': email}).eq("id", query[record]['id']).execute()
                

    def users_script(self):
        response = self.database.connect()
        if not self.database.connection:
            self.logger.info("Could not connect to the database")
            return
        

        query = response.table("mentors").select("*").execute()
        query = json.loads(query.model_dump_json())['data']               
        
        for record in range(len(query)):
            name = query[record]['name'].split(' ')[0]
            email = query[record]['email']
            password = name[0].upper() + name[1:] + "@123"

            bytes = password.encode('utf-8') 
            salt = bcrypt.gensalt()
            hash = bcrypt.hashpw(bytes, salt)

            salt = str(salt)[2: -1]
            hash = str(hash)[2: -1]

            year = int(datetime.today().year) - random.randint(22, 34)
            month = int(datetime.today().month) + random.randint(-1, 10)
            day = int(datetime.today().day) + random.randint(-11, 15)

            dob = datetime(year, month, day).date().isoformat()
            
            try:
                response.table("users").insert({"name": query[record]['name'], "dob":dob, "type":"mentor", "email":email, "password":hash, "salt":salt}).execute()

            except:
                continue
           

if __name__ == "__main__":   

    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    # SCRIPT(logger).mentors_email_script()
    # SCRIPT(logger).users_script()