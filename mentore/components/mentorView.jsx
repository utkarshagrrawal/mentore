import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

export function MentorView() {
    const [mentorData, setMentorData] = useState([]); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/mentorProfile'); 
                setMentorData(response.data.result); 
            } catch (error) {
                console.error('Error fetching mentor data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className='flex flex-col w-3/4 mx-auto '>
                {mentorData.map((mentor, index) => (
                    <div key={index}>
                        <div>
                            <h1>{mentor.name}</h1>
                            <p>{mentor.company}</p>
                            <p>{mentor.profession}</p>
                        </div>
                        <div>
                            <p>{mentor.experience}</p>
                        </div>
                        <div>
                            {/* <p>{mentor.rating}</p> */}
                        </div>
                       
                    </div>
                ))}
            </div>
        </div>
    );
}
