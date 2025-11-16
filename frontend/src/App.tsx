import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="h-screen w-full">
      <Outlet />
    </div>
  );
}

export default App;