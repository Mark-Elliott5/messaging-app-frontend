function App() {
  return (
    <>
      <div id='conversations-and-profile' className='left-sidebar'>
        <div id='conversations'></div>
        <div id='profile'></div>
      </div>
      <div id='middle-column'>
        <div id='messages'></div>
        <div id='message-input'>
          <input
            type='text'
            name='content'
            id='messsage-content'
            placeholder='Type here...'
          />
          <button id='send-message'></button>
        </div>
      </div>
      <div id='users' className='right-sidebar'>
        <div id='online'></div>
        <div id='offline'></div>
      </div>
    </>
  );
}

export default App;
