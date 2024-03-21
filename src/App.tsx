import { useEffect, useState } from 'react';
import UsersOnline from './components/UsersOnline';
import LoginPage from './components/LoginPage';
import Rooms from './components/Rooms';
import MessageList from './components/MessageList';
import TypingIndicator from './components/TypingIndicator';
import MessageForm from './components/MessageForm';
import './app.css';
import ProfileTab from './components/ProfileTab';
import ServerMessage from './components/ServerMessage';

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
    <div className='grid w-dvw grid-cols-2 grid-rows-[minmax(100px,_500px)_minmax(0,_1fr)] gap-2 bg-wire-700 p-2 font-inter md:h-dvh md:grid-cols-131 md:grid-rows-none md:gap-4 md:overflow-hidden md:p-4'>
      <div
        id='rooms-and-profile'
        className='col-span-1 col-start-1 row-start-2 flex flex-col gap-2 rounded-md md:col-start-1 md:row-start-1 md:gap-4'
      >
        <Rooms room={room} setRoom={setRoom} />
        <ProfileTab />
      </div>
      <div
        id='middle-column'
        className='col-span-2 row-start-1 flex flex-col rounded-md border-1 border-wire-200 bg-wire-500 shadow-wire md:col-span-1 md:col-start-2'
      >
        <MessageList room={room} />
        <TypingIndicator room={room} />
        <MessageForm room={room} />
      </div>
      <div className='col-span-1 col-start-2 row-start-2 flex flex-col items-center justify-between gap-2 overflow-y-scroll rounded-md md:col-start-3 md:row-start-1 md:gap-4'>
        <UsersOnline setLoggedIn={setLoggedIn} room={room} />
      </div>
      <ServerMessage />
    </div>
  ) : (
    <LoginPage setLoggedIn={setLoggedIn} />
  );
}

export default App;
