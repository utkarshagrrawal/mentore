import os
from supabase import create_client
from dotenv import load_dotenv


class DATABASE:
    def __init__(self, logger):
        load_dotenv()

        self.logger = logger
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")
        self.connection = False

    def connect(self):
        try:
            response = create_client(self.supabase_url, self.supabase_key)
            self.logger.info("Connection established to database successfully")
            self.connection = True
            return response

        except Exception as e:
            self.logger.info("Connection to database failed")
            return None