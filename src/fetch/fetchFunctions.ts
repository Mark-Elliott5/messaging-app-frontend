import axios, { AxiosResponse } from 'axios';
import { IDirectMessageTab, IMessage } from '../types/fetchTypes';

async function getMessages(roomId: string) {
  try {
    const response: AxiosResponse<{ messages: IMessage[] }> = await axios.get(
      `/api/messages/${roomId}`
    );
    return response;
  } catch (error) {
    console.error(`Axios GET leaderboad error: ${error}`);
    return Promise.reject(error);
  }
}

async function getDMTabs() {
  try {
    const response: AxiosResponse<{ directMessageTabs: IDirectMessageTab[] }> =
      await axios.get(`/api/directmessages/`);
    return response;
  } catch (error) {
    console.error(`Axios GET DM tabs error: ${error}`);
    return Promise.reject(error);
  }
}

// async function getDMs() {
//   try {
//     const response: AxiosResponse<{ directMessageTabs: IDirectMessageTab[] }> =
//       await axios.get(`/api/directmessages/`);
//     return response;
//   } catch (error) {
//     console.error(`Axios GET DM tabs error: ${error}`);
//     return Promise.reject(error);
//   }
// }

async function login(username: string, password: string) {
  try {
    const response: AxiosResponse<{
      authenticated: boolean;
      message?: string;
    }> = await axios.post('/login', {
      username,
      password,
    });
    return response;
  } catch (error) {
    console.error(`Axios POST login error: ${error}`);
    return Promise.reject(error);
  }
}

async function guestLogin(username: string) {
  try {
    const response: AxiosResponse<{
      authenticated: boolean;
      message?: string;
    }> = await axios.post('/guestlogin', {
      username,
    });
    return response;
  } catch (error) {
    console.error(`Axios POST login error: ${error}`);
    return Promise.reject(error);
  }
}

async function register(username: string, password: string) {
  try {
    const response: AxiosResponse<{
      authenticated: boolean;
      message?: string;
    }> = await axios.post('/register', {
      username,
      password,
    });
    return response;
  } catch (error) {
    console.error(`Axios POST login error: ${error}`);
    return Promise.reject(error);
  }
}

export { getMessages, getDMTabs, guestLogin, login, register };

///

// {
//   Id,
//   Content,
//   Sender: points to Member document,
//   Recipient: points to Member document (or general chat document),
//   room,
//   Date: date,
//   }
