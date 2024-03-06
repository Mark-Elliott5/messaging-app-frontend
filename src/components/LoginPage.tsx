import { useState } from 'react';
import { guestLogin, login, register } from '../fetch/fetchFunctions';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';

function LoginPage({
  setLoggedIn,
}: {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [page, setPage] = useState<'guest' | 'login' | 'register'>('login');
  const [message, setMessage] = useState<string | undefined>(undefined);

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const username = new FormData(e.currentTarget).get('username');
    const password = new FormData(e.currentTarget).get('password');
    try {
      if (!username) {
        throw new Error('Username required');
      }
      if (!password) {
        throw new Error('Password required');
      }
      const response = await login(username as string, password as string);
      if (!response.data) {
        throw new Error(`Login failed`);
      }
      if (!response.data.authenticated) {
        throw new Error(response.data.message ?? 'Unknown login error');
      }
      setLoggedIn(true);
    } catch (err) {
      console.error('Login error: ' + err);
      setMessage((err as Error).message);
    }
  };

  const handleGuestLogin: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    const username = new FormData(e.currentTarget).get('username');
    try {
      if (!username) {
        throw new Error('Username required');
      }
      const response = await guestLogin(username as string);
      if (!response.data) {
        throw new Error(`Login failed`);
      }
      if (!response.data.authenticated) {
        throw new Error(response.data.message ?? 'Unknown guest login error');
      }
      setLoggedIn(true);
    } catch (err) {
      console.error('guestLogin error: ' + err);
      setMessage((err as Error).message);
    }
  };

  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const username = new FormData(e.currentTarget).get('username');
    const password = new FormData(e.currentTarget).get('password');
    try {
      if (!username) {
        throw new Error('Username required');
      }
      if (!password) {
        throw new Error('Password required');
      }
      const response = await register(username as string, password as string);
      if (!response.data) {
        throw new Error(`Login failed`);
      }
      if (!response.data.authenticated) {
        throw new Error(response.data.message ?? 'Unknown register error');
      }
      setLoggedIn(true);
    } catch (err) {
      console.error('guestLogin error: ' + err);
      setMessage((err as Error).message);
    }
  };

  const loginPage = (
    <form onSubmit={handleLogin} className='flex flex-col gap-2'>
      <input
        type='text'
        name='username'
        placeholder='Username'
        minLength={1}
        className='rounded-md bg-wire-400 px-2 py-1 text-center placeholder-wire-50 outline-none placeholder:text-center placeholder:italic'
      />
      <input
        type='text'
        name='password'
        placeholder='Password'
        minLength={1}
        className='rounded-md bg-wire-400 px-2 py-1 text-center placeholder-wire-50 outline-none placeholder:text-center placeholder:italic'
      />
      <button className='mb-2 rounded-md bg-wire-200 px-2 py-1' type='submit'>
        Login
      </button>
      <button
        className='rounded-md bg-wire-300 px-2 py-1'
        type='button'
        onClick={() => setPage('register')}
      >
        Register
      </button>
      <button
        className='rounded-md bg-wire-300 px-2 py-1'
        type='button'
        onClick={() => setPage('guest')}
      >
        Login as a Guest
      </button>
    </form>
  );

  const guestLoginPage = (
    <form onSubmit={handleGuestLogin} className='flex flex-col gap-2'>
      <input
        type='text'
        name='username'
        placeholder='Username'
        minLength={1}
        className='rounded-md bg-wire-400 px-2 py-1 text-center placeholder-wire-50 outline-none placeholder:text-center placeholder:italic'
      />
      <button className='mb-2 rounded-md bg-wire-200 px-2 py-1' type='submit'>
        Enter as a Guest
      </button>
      <button
        className='rounded-md bg-wire-300 px-2 py-1'
        type='button'
        onClick={() => setPage('login')}
      >
        User Login
      </button>
      <button
        className='rounded-md bg-wire-300 px-2 py-1'
        type='button'
        onClick={() => setPage('register')}
      >
        Register
      </button>
    </form>
  );

  const registerPage = (
    <form onSubmit={handleRegister} className='flex flex-col gap-2'>
      <input
        type='text'
        name='username'
        placeholder='Username'
        minLength={1}
        className='rounded-md bg-wire-400 px-2 py-1 text-center placeholder-wire-50 outline-none placeholder:text-center placeholder:italic'
      />
      <input
        type='text'
        name='password'
        placeholder='Password'
        minLength={1}
        className='rounded-md bg-wire-400 px-2 py-1 text-center placeholder-wire-50 outline-none placeholder:text-center placeholder:italic'
      />
      <button className='mb-2 rounded-md bg-wire-200 px-2 py-1' type='submit'>
        Register
      </button>
      <button
        className='rounded-md bg-wire-300 px-2 py-1'
        type='button'
        onClick={() => setPage('login')}
      >
        User Login
      </button>
      <button
        className='rounded-md bg-wire-300 px-2 py-1'
        type='button'
        onClick={() => setPage('guest')}
      >
        Login as a Guest
      </button>
    </form>
  );

  return (
    <div className='flex h-dvh w-dvw items-center justify-center overflow-hidden bg-wire-700'>
      <AnimatePresence>
        <LazyMotion features={domAnimation}>
          <m.div
            animate={{
              transition: { duration: 1, type: 'spring' },
              scale: 1,
            }}
            exit={{ opacity: 0 }}
            style={{ scale: 0.1 }}
            className='md:w-unset md:h-unset flex h-dvh w-dvw flex-col items-center justify-center gap-2 rounded-md bg-wire-600 p-24 shadow-x'
          >
            <h1>Welcome to Wire</h1>
            <h2>Chat Room</h2>
            {page === 'login'
              ? loginPage
              : page === 'register'
                ? registerPage
                : guestLoginPage}
            {message && <p className='text-red-500'>{message}</p>}
          </m.div>
        </LazyMotion>
      </AnimatePresence>
    </div>
  );
}

export default LoginPage;
