import LeftSidebar from './components/LeftSidebar';
import MiddleColumn from './components/MiddleColumn';
import RightSidebar from './components/RightSidebar';

function App() {
  return (
    <div className='grid grid-cols-131 h-dvh w-dvw'>
      <LeftSidebar />
      <MiddleColumn />
      <RightSidebar />
    </div>
  );
}

export default App;
