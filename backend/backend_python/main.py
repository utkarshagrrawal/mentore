import json
import logging
import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel


from utils.scheduler                        import SCHEDULER
from utils.database                         import DATABASE
from utils.recommendation_engine.recommend  import RECOMMEND
from utils.recommendation_engine.similarity import SIMILARITY


backend = FastAPI()

class SCHEDULE_REQUEST(BaseModel):
    req_start_date : str
    req_end_date   : str
    mentor_email   : str


@backend.post('/schedule')
def schedule(input: SCHEDULE_REQUEST):

    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    database = DATABASE(logger)
    response = database.connect()

    if not database.connection:
        return JSONResponse(content=None)
    
    try:
        scheduler = SCHEDULER(logger, response)
        res = scheduler.isValid(input.req_start_date, input.req_end_date, input.mentor_email)

        return JSONResponse(content={'Error': '', 'response': res}, status_code=200)
    
    except Exception as e:
        return JSONResponse(content={'Error': e, 'response': ''}, status_code=422)


@backend.post('/recommend')
def recommend_mentors(input:str, topn_skills:int=10, topn_mentors:int=50):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    database = DATABASE(logger)
    response = database.connect()

    if not database.connection:
        return JSONResponse(content=None)
    
    try:
        recommend = RECOMMEND(logger)
        skills = recommend.recommend(response, input, topn_skills)

        if len(skills) > 0:
            similarity          = SIMILARITY(logger)
            mentors             = similarity.fetch_data(response)
            recommended_mentors = similarity.calculate_similar_mentors(skills, mentors, topn_mentors)
            
            logger.info(f'Number of mentors recommended: {len(recommended_mentors)}')
            return JSONResponse(content={'Error': '', 'response':json.dumps(recommended_mentors, indent=2)}, status_code=200)
        
        else:
            logger.info(f'Number of mentors recommended: 0')
            return JSONResponse(content={'Error': '', 'response':json.dumps([], indent=2)}, status_code=200)        


    except Exception as e:
        logger.error(f'Error while recommending mentors: {e}')
        return JSONResponse(content={'Error': e, 'response': ''}, status_code=422)


if __name__ == "__main__":
    uvicorn.run(backend, host="localhost", port=9000)
