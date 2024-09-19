
import './App.css'
import Chat from './components/taskcomponets/Chat';
import LineGraph from './components/taskcomponets/LineGraph';
import MainTable from './components/taskcomponets/MainTable';

function App() {


  return (
    <div className="p-4 bck">
      <div className='p-4'>
        <h1 className="text-2xl font-bold mb-4 text-center p-4">chat app task 3 or Bonus task💬</h1>
        <Chat />
      </div>
      <h1 className="text-2xl font-bold mt-8 mb-4 text-center p-4"></h1>
      <h1 className="text-2xl font-bold mt-8 mb-4 text-center p-4">statistics of number of jobs over Year 📊 Task 2: Analytics </h1>
      <LineGraph />
      <h1 className="text-2xl font-bold mb-4 text-center p-4">Main Table 📖 Task 1: Basic Table</h1>
      <MainTable />
      

      
    </div>
  );

}

export default App
