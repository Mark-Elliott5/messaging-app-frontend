function MiddleColumn() {
  return (
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
  );
}

export default MiddleColumn;
