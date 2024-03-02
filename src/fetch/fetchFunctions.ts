import axios, { AxiosResponse } from 'axios';
import { IMessage } from '../types/fetchTypes';

async function getMessages(conversationId: string) {
  try {
    const response: AxiosResponse<IMessage[]> = await axios.get(
      `/api/getMessages/${conversationId}`
    );
    return response;
  } catch (error) {
    console.error(`Axios GET leaderboad error: ${error}`);
    return Promise.reject(error);
  }
}

export { getMessages };

// {
//   Id,
//   Content,
//   Sender: points to Member document,
//   Recipient: points to Member document (or general chat document),
//   Conversation,
//   Date: date,
//   }
