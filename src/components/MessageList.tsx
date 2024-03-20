import useWebsocket from 'react-use-websocket';
import {
  IResponseUser,
  IStoredMessage,
  MessageResponse,
} from '../types/wsMessageTypes';
import { useEffect, useState } from 'react';
import Message from './Message';

function MessageList({ room }: { room: string }) {
  // needs room id inherited from state to supply to first websocket hook arg
  const [loading] = useState(false);
  const [messageHistory, setMessageHistory] = useState<IStoredMessage[]>([]);
  // const messageBuffer = useRef<IMessage[]>([]);

  const { readyState } = useWebsocket(`ws://${window.location.host}/chat`, {
    share: true, // Shares ws connection to same URL between components
    onMessage: (e) => {
      try {
        const data: MessageResponse = JSON.parse(e.data);
        if (data.type === 'message') {
          const { user } = data;
          const latestMessage = messageHistory[messageHistory.length - 1];
          const latestUser = latestMessage?.user.username;
          if (!latestMessage || !latestUser) {
            return setMessageHistory((prevState) => [...prevState, data]);
          }
          const timeElapsed =
            new Date(data.date).getTime() -
            new Date(latestMessage.date).getTime();
          if (user.username !== latestUser || timeElapsed > 300000) {
            return setMessageHistory((prevState) => [...prevState, data]);
          }
          const newHistory = Array.from(messageHistory);
          const content =
            typeof latestMessage.content === 'string'
              ? [latestMessage.content, data.content]
              : [...latestMessage.content, data.content];
          const newMessage: IStoredMessage = {
            type: 'message',
            content,
            user,
            date: data.date,
          };
          newHistory.pop();
          newHistory.push(newMessage);
          return setMessageHistory(newHistory);
        }
        if (data.type === 'messageHistory') {
          if (!data.messageHistory.length) {
            return;
          }
          data.messageHistory.reverse();
          const history = data.messageHistory.reduce(
            (newArr: IStoredMessage[], cur, i) => {
              const prevMessage = newArr[newArr.length - 1];
              if (i === 0 || prevMessage.user.username !== cur.user.username) {
                newArr.push(cur);
                return newArr;
              }
              const timeElapsed =
                new Date(cur.date).getTime() -
                new Date(prevMessage.date).getTime();
              if (timeElapsed > 300000) {
                newArr.push(cur);
                return newArr;
              }
              if (typeof prevMessage.content === 'string') {
                const newContent = [prevMessage.content, cur.content];
                prevMessage.content = newContent;
                return newArr;
              }
              prevMessage.content.push(cur.content);
              return newArr;
            },
            []
          );
          setMessageHistory(history);
        }
        if (data.type === 'usersOnline') {
          if (!messageHistory.length) {
            return;
          }
          const newUsers: Map<string, IResponseUser> = new Map();
          for (const user of data.usersOnline) {
            newUsers.set(user.username, user);
          }
          const newHistory = Array.from(messageHistory);
          for (let i = 0; i < newHistory.length; i++) {
            const userUpdated = newUsers.get(newHistory[i].user.username);
            if (!userUpdated) {
              continue;
            }
            newHistory[i].user.avatar = userUpdated.avatar;
            newHistory[i].user.bio = userUpdated.bio;
          }
          setMessageHistory(newHistory);
        }
      } catch (err) {
        console.log(err);
      }
    },
    onError: (err) => {
      console.log('MessageList websocket error: ');
      console.log(err);
    },
    retryOnError: true,
    shouldReconnect: (e) => {
      // code 1000 is 'Normal Closure'
      if (e.code !== 1000) {
        return true;
      }
      return false;
    },
    reconnectAttempts: 3, // Applies to retryOnError as well as reconnectInterval
    reconnectInterval: 3000,
    // Every time readyState or lastMessage changes, the component rerenders, even
    // if it is not destructured from useWebsocket or used in the function body.
    // when filter returns false, lastMessage will not be updated. The 'on" options
    // (onMessage, etc), will still receive filtered messages though, which we
    // can then use to update our own state or reference. so filter stops unnecessary
    // automatic rerenders, then we can handle the message in onMessage
    filter: (e) => {
      console.log(e);
      try {
        const data: MessageResponse = JSON.parse(e.data);
        if (
          data.type === 'message' ||
          data.type === 'messageHistory' ||
          data.type === 'usersOnline'
        ) {
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  });

  const messages = (() => {
    return messageHistory.length
      ? messageHistory
          .toReversed()
          .map((message) => (
            <Message
              key={`${message.date}${message.content}${message.user.username}`}
              message={message}
            />
          ))
      : null;
  })();

  const connectionStatusClasses = (() => {
    if (readyState === -1 || readyState >= 2) {
      return 'bg-red-400 border-red-500';
    }
    if (readyState === 0) {
      return 'bg-yellow-400 border-yellow-500';
    }
    if (readyState === 1) {
      return 'bg-green-400 border-green-500';
    }
  })();

  useEffect(() => {
    setMessageHistory([]);
  }, [room]);

  return (
    <>
      <div className='flex w-full items-center gap-2 overflow-hidden rounded-t-md bg-wire-400 p-2'>
        <span
          className={`h-3 w-3 ${connectionStatusClasses} rounded-full border-1`}
        />
        <span className='font-bold'>{room}</span>
      </div>
      <div
        id='messages'
        className='flex h-dvh flex-[1_1_0] flex-col-reverse overflow-y-scroll'
      >
        {messages?.length ? (
          messages
        ) : loading ? (
          <p className='text-center italic'>Loading...</p>
        ) : (
          <p className='text-center italic'>No messages yet!</p>
        )}
      </div>
    </>
  );
}

export default MessageList;
