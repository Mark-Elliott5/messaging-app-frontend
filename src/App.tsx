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
  const [loggedIn, setLoggedIn] = useState(true);
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
    <div className='grid h-dvh w-dvw grid-cols-131 gap-4 overflow-hidden bg-wire-700 p-4 font-inter'>
      <div id='rooms-and-profile' className='flex flex-col gap-4 rounded-md'>
        <Rooms room={room} setRoom={setRoom} />
        <ProfileTab />
      </div>
      <div
        id='middle-column'
        className='shadow-wire flex flex-col rounded-md bg-wire-500'
      >
        <MessageList room={room} />
        <TypingIndicator room={room} />
        <MessageForm room={room} />
      </div>
      <UsersOnline setLoggedIn={setLoggedIn} room={room} />
    </div>
  ) : (
    <LoginPage setLoggedIn={setLoggedIn} />
  );
}

export default App;
