import { React, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { data } from '../src/assets/stories';
import { questions } from '../src/assets/question_ans';




export function Home() {
  const [visible, setVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const welcomeMessages = [
    'Cracking your dream job',
    'Staying consistent and motivated',
    'Cracking On Campus Placements',
    'Growing in your current role',
    'Switching to a new Domain'
  ]
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const handleChange = () => {
    setVisible(!visible);
    if (visible) {
      document.getElementById('navbar-default').classList.add('hidden')
    } else {
      document.getElementById('navbar-default').classList.remove('hidden')
    }
  }

  useEffect(() => {
    const getUser = async () => {
      let options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
      }
      let users = await fetch('http://localhost:3000/getcurrentuser', options);
      const result = await users.json();
      if (result.error) {
        setLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
      } else {
        setLoggedIn(true);
      }
    }
    getUser();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(index => index + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [])

  const handleSearch = (e => {
    e.preventDefault();
  })

  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 3 >= data.length ? 0 : prevIndex + 3
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleQuestionClick = (id) => {
    setSelectedQuestion(id === selectedQuestion ? null : id);
  };


  return (
    <>
      <nav className="bg-white border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="../static/logo.png" className="h-8" alt="Mentore" />
          </Link>
          <button data-collapse-toggle="navbar-default" type="button" aria-controls="navbar-default" onClick={handleChange} className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-expanded={visible ? 'true' : 'false'}>
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
              <li>
                <Link to="/find-mentor" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Find mentor</Link>
              </li>
              <li>
                <Link to="/liveWebinars" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Live Webinars</Link>
              </li>
              <li>
                <Link to="/ask-mentor" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Ask mentor</Link>
              </li>
              {!loggedIn ? (
                <li>
                  <Link to="/login" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Login</Link>
                </li>
              ) :
                (
                  <li>
                    <Link to="/profile" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Dashboard</Link>
                  </li>
                )}
            </ul>
          </div>
        </div>
      </nav>
      <hr />

      <div className='flex flex-col items-center justify-center p-4 mx-4 lg:mx-20 my-10 bg-gradient-to-r from-blue-300 via-gray-300 to-yellow-300 rounded-lg h-96'>
        <div className='flex flex-col items-center'>
          <h1 className='font-sans text-4xl font-semibold mb-4'>1:1 Long Term Mentorship for</h1>
          <h1 className='font-sans text-3xl font-semibold transition-opacity duration-500 hover:opacity-50' id='welcomeText'>{welcomeMessages[index % welcomeMessages.length]}</h1>
        </div>
        <form className='m-10' onSubmit={handleSearch}>
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="default-search" className="block w-64 md:w-80 lg:w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search domains, mentors..." required />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
          </div>
        </form>
      </div>

      <div className='flex flex-col justify-center items-center mt-10'>
        <p className='font-bold md:text-6xl text-2xl mb-12'>Our Testimonials</p>
        <div className="flex flex-wrap justify-center w-full transition-all duration-5000">
          {data.slice(currentIndex, currentIndex + 3).map((data) => (
            <div key={data.id} className="card flex flex-col rounded-lg border-solid border-2 border-dark-500 mx-8 justify-center p-5 pt-9 h-608px w-96 shadow-2xl mb-8">
              <img src={data.img} className='flex self-center rounded-lg h-80 w-72 mb-7 object-contain' alt="author photo" />
              <p className='flex self-center text-xl font-medium mb-5'>{data.name}</p>
              <hr />
              <p className='flex self-center text-lg font-normal'>{data.review}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col mb-10 gap-4 justify-center items-center mx-auto'>
        <p className='font-bold md:text-6xl text-2xl'>No need to struggle</p>
        <p className='font-bold md:text-6xl text-2xl'>alone anymore</p>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 md:gap-2 w-3/4 mx-auto mb-20">
        <div className='flex flex-col items-center justify-center md:flex-row border-solid border-2 border-dark-500 rounded-lg p-10'>
          <div className='flex flex-col w-64 p-1 '>
            <p className='mb-8 text-sm'>1:1 SESSION</p>
            <div>
              <p className='text-2xl font-medium mb-3'>Never question your progress with frequent 1:1 sessions</p>
              <p className='text-sm'>Mentor will use this 1 hour sessions to solve problems, learn concepts, do projects, strategies & everything needed to achieve your goals. </p>
            </div>
          </div>
          <div className='flex items-center justify-center w-1/2'>
            <img src="../static/grid_2.jpg" className='rounded-lg' alt="grid image" />
          </div>
        </div>

        <div className='flex flex-col items-center justify-center md:flex-row border-solid border-2 border-dark-500 rounded-lg p-10 '>
          <div className='flex flex-col w-64 p-1'>
            <p className='mb-8 text-sm '>UNLIMITED CHAT</p>
            <div>
              <p className='text-2xl font-medium mb-3'>Doubts? Get the right advice from your mentor via Chat</p>
              <p className='text-sm'>Mentor will be just one ping away to solve all your queries whenever required.</p>
            </div>
          </div>
          <div className='flex items-center justify-center w-1/2'>
            <img src="../static/grid-4.jpg" className='rounded-lg' alt="grid image" />
          </div>
        </div>

        <div className='flex flex-col items-center justify-center md:flex-row border-solid border-2 border-dark-500 rounded-lg p-10'>
          <div className='flex flex-col w-64 p-1'>
            <p className='mb-8 text-sm'>REGULAR FOLLOWUPS</p>
            <div>
              <p className='text-2xl font-medium mb-3'>Stay motivated and consistent with regular follow-ups</p>
              <p className='text-sm'>Mentor will keep a check on you, motivate and unblock you regularly.</p>
            </div>
          </div>
          <div className='flex items-center justify-center w-1/2'>
            <img src="../static/grid-3.webp" className='rounded-lg' alt="grid image" />
          </div>
        </div>

        <div className='flex flex-col items-center justify-center md:flex-row border-solid border-2 border-dark-500 rounded-lg p-10'>
          <div className='flex flex-col w-64 p-1'>
            <p className='mb-8 text-sm'>TASKS & RESOURCES</p>
            <div>
              <p className='text-2xl font-medium mb-3'>Avoid wasting time on irrelevant tasks and resources</p>
              <p className='text-sm'>Mentor will give you clearly defined take home tasks, assignments and associated resources to study, personalised to your goals.</p>
            </div>
          </div>
          <div className='flex items-center justify-center w-1/2'>
            <img src="../static/grid_1.webp" className='rounded-lg' alt="grid image" />
          </div>
        </div>
      </div>


      <div className='flex flex-col mb-10 gap-4 justify-center items-center mx-auto'>
        <p className='font-bold md:text-6xl text-2xl'>Frequently Asked</p>
        <p className='font-bold md:text-6xl text-2xl'>Questions</p>
      </div>



      <div className='flex w-3/4 flex-col mx-auto mb-20'>
        {questions.map(({ id, question, answer }) => (
          <div key={id} className="w-full mb-4">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium text-black border border-b-0 border-gray-200 rounded-t-xl  dark:text-black hover:bg-gray-100 dark:hover:bg-gray-200 gap-3"
              onClick={() => handleQuestionClick(id)}
            >
              <span>{question.split(': ')[1]}</span>
              <svg
                className="w-3 h-3 rotate-180 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
              </svg>
            </button>
            {selectedQuestion === id && (
              <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-150 dark:bg-gray-100">
                <p className="mb-2 text-gray-500 dark:text-black">{answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="bg-white rounded-lg inset-x-0 relative bottom-0">
        <hr />
        <div className="w-full max-w-screen-xl mx-auto px-4 py-2 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="../static/logo.png" className="h-8" alt="Mentore" />
            </Link>
            <ul className="font-medium flex flex-col p-2 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
              <li>
                <Link to="/find-mentor" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Find mentor</Link>
              </li>
              <li>
                <Link to="/liveWebinars" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Live Webinars</Link>
              </li>
              <li>
                <Link to="/ask-mentor" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Ask mentor</Link>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-4" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <Link to='/' className="hover:underline">Mentore™</Link>. All Rights Reserved.</span>
        </div>
      </footer>
    </>
  )
}
