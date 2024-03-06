import LeftSidebar from './components/LeftSidebar';
import MiddleColumn from './components/MiddleColumn';
import RightSidebar from './components/RightSidebar';

function App() {
  return (
    <div className='font-inter grid h-dvh w-dvw grid-cols-131'>
      <LeftSidebar />
      <MiddleColumn />
      <RightSidebar />
    </div>
  );
}

export default App;
