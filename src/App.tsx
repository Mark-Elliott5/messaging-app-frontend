import { useState } from 'react';
import LeftSidebar from './components/LeftSidebar';
import MiddleColumn from './components/MiddleColumn';
import RightSidebar from './components/RightSidebar';
import LoginPage from './components/LoginPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [conversation, setConversation] = useState<string>('general');

  return loggedIn ? (
    <div className='grid h-dvh w-dvw grid-cols-131 overflow-hidden font-inter'>
      <LeftSidebar setConversation={setConversation} />
      <MiddleColumn conversation={conversation} />
      <RightSidebar />
    </div>
  ) : (
    <LoginPage setLoggedIn={setLoggedIn} />
  );
}

export default App;
