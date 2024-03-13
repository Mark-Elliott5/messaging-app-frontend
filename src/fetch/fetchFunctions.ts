import axios, { AxiosResponse } from 'axios';

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

export { guestLogin, login, register };
