import { useEffect, useState } from 'react';
import UsersOnline from './components/UsersOnline';
import LoginPage from './components/LoginPage';
import Rooms from './components/Rooms';
import MessageList from './components/MessageList';
import TypingIndicator from './components/TypingIndicator';
import MessageForm from './components/MessageForm';
import './app.css';
import ProfileTab from './components/ProfileTab';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState<string>('General');

  useEffect(() => {
    const checkCookies = () => {
      const cookies = document.cookie.split(';');
      const cookieMap = new Map();

      cookies.forEach((cookie) => {
        const [name, value] = cookie.split('=').map((part) => part.trim());
        cookieMap.set(name, value);
      });
      const authenticated = cookieMap.get('loggedIn');
      if (authenticated === 'true') {
        console.log(authenticated);
        setLoggedIn(true);
      }
    };
    checkCookies();
  }, []);

  return loggedIn ? (
    <div className='grid h-dvh w-dvw grid-cols-2 grid-rows-2 gap-4 overflow-hidden bg-wire-700 p-4 font-inter md:grid-cols-131 md:grid-rows-none'>
      <div
        id='rooms-and-profile'
        className='col-span-1 col-start-1 row-start-2 flex flex-col gap-4 rounded-md md:col-start-1 md:row-start-1'
      >
        <Rooms room={room} setRoom={setRoom} />
        <ProfileTab />
      </div>
      <div
        id='middle-column'
        className='col-span-2 row-start-1 flex flex-col rounded-md bg-wire-500 shadow-wire md:col-span-1 md:col-start-2'
      >
        <MessageList room={room} />
        <TypingIndicator room={room} />
        <MessageForm room={room} />
      </div>
      <div className='col-span-1 col-start-2 row-start-2 flex flex-col items-center justify-between gap-4 overflow-y-scroll rounded-xl md:col-start-3 md:row-start-1'>
        <UsersOnline setLoggedIn={setLoggedIn} room={room} />
      </div>
    </div>
  ) : (
    <LoginPage setLoggedIn={setLoggedIn} />
  );
}

export default App;
