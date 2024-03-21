function LogoutButton({ handleLogout }: { handleLogout: () => void }) {
  return (
    <div
      className='flex w-full cursor-pointer items-center rounded-md border-1 border-wire-300 bg-wire-400 p-2 shadow-wire'
      onClick={handleLogout}
    >
      <div className='flex h-9 w-full flex-row-reverse items-center text-right'>
        <svg
          className='ml-2 inline-block'
          xmlns='http://www.w3.org/2000/svg'
          height='24px'
          viewBox='0 0 24 24'
          width='24px'
          fill='#FFFFFF'
        >
          <path d='M0 0h24v24H0z' fill='none' />
          <path d='M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z' />
        </svg>
        <span className=''>Logout</span>
      </div>
    </div>
  );
}

export default LogoutButton;
