import { useState } from 'react';
import UsersOnline from './components/UsersOnline';
import LoginPage from './components/LoginPage';
import Rooms from './components/Rooms';
import MessageList from './components/MessageList';
import TypingIndicator from './components/TypingIndicator';
import MessageForm from './components/MessageForm';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState<string>('general');

  return loggedIn ? (
    <div className='grid h-dvh w-dvw grid-cols-131 overflow-hidden font-inter'>
      <div id='rooms-and-profile' className='bg-wire-600'>
        <Rooms room={room} setRoom={setRoom} />
        <div id='profile'></div>
      </div>
      <div
        id='middle-column'
        className='z-10 flex flex-col bg-wire-500 shadow-x'
      >
        <MessageList room={room} />
        <TypingIndicator />
        <MessageForm room={room} />
      </div>
      <UsersOnline />
    </div>
  ) : (
    <LoginPage setLoggedIn={setLoggedIn} />
  );
}

export default App;
