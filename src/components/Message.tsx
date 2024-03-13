import { IMessage } from '../types/wsMessageTypes';

function Message({ message }: { message: IMessage }) {
  const formatDate = (str: string) => {
    const date = new Date(str);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className='mx-3 my-1'>
      <img src={`${message.user?.avatar}.jpg`}></img>
      <div>
        <div>
          <span className=''>{message.user?.username}</span>
          <span className=''>{formatDate(message.date)}</span>
        </div>
        <p className='ml-1'>{message.content}</p>
      </div>
    </div>
  );
}

export default Message;
