import Conversations from './Conversations';

function LeftSidebar({
  setConversation,
}: {
  setConversation: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div id='conversations-and-profile' className='bg-wire-600'>
      <Conversations setConversation={setConversation} />
      <div id='profile'></div>
    </div>
  );
}

export default LeftSidebar;
