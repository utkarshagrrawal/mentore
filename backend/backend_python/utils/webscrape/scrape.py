import os
import sys
import time
import logging  
from bs4                               import BeautifulSoup
from selenium                          import webdriver
from selenium.webdriver.common.by      import By

from database import DATABASE


class SCRAPE:
    def __init__(self, logger, website):
        if website == "mentor":
            self.url              = os.getenv("MENTOR")

        self.mentors_show_more    = os.getenv("MENTORS_SHOW_MORE")  
        self.class_mentor         = os.getenv("CLASS_MENTOR")   
        self.image_url            = os.getenv("IMAGE_URL")      
        self.class_mentor_details = os.getenv("CLASS_MENTOR_DETAILS")
        self.logger               = logger
        self.driver               = None    
        self._id                  = 1        
        

    def connect(self):
        try:
            self.driver = webdriver.Chrome()
            self.driver.get(self.url)
            self.logger(f"Established connection successfully")
            time.sleep(15)

        except Exception as e:
            self.logger.info(f"Error in establishing connection: {e}")


    def scrape_mentor(self):
        for _ in range(20):
            try:
                button = self.driver.find_element(By.XPATH, self.mentors_show_more)            
                button.click()
                cnt += 1
                time.sleep(15)
            
            except:
                time.sleep(5)
                continue

        source_html = self.driver.page_source
        self.logger.info("Successfully fetched the data for mentors")
        self.driver.quit()

        soup = BeautifulSoup(source_html, 'html.parser')
        mentor_div = soup.find_all('div', attrs={'class': self.class_mentor})

        database = DATABASE(self.logger)
        response = database.connect()
        
        for section in mentor_div:
            tags = section.find_all('span', attrs={'class': self.class_mentor_details})[3:]
            exp_tag = section.find('span', attrs={'class':''})

            name = tags[0].text
            profession = tags[1].text
            company = tags[2].text
            skills = {'skills': [skill.text for skill in tags[3:]]}
            image = self.image_url

            try:
                experience = int(exp_tag.text.split('yrs')[0])
            except:
                experience = 5

            response.table("mentors").insert({'id':self._id, 'name':name, 'profession':profession, 'company':company, 'skills':skills, 'experience':experience, 'photo':image}).execute()
            
            self._id += 1



if __name__ == "__main__":
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    scrape_obj = SCRAPE(logger, "https://www.preplaced.in/explore-mentors")
    scrape_obj.scrape_mentor()