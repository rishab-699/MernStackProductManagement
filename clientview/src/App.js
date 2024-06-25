import axios from 'axios';
import {useEffect, useState,} from 'react'
import './App.css';
import Pagination from './components/productspage/Pagination';
import Stats from './components/statscard/Stats';
import Barchart from './components/barchart/Barchart';
import Piechart from './components/piechart/Piechart';

function App() {
  const [data, setData] = useState();
  const [barchartData, setBarChartData] = useState([]);
  const [piechartData, setpieChartData] = useState([]);
  useEffect(()=>{
    const fetchData= async()=>{
      try {
        const data = await axios.get('http://localhost:5000/api/products/');
        //console.log(data.data)
        await setBarChartData(data.data.barChart);
        await setpieChartData(data.data.pieChart);
        await setData(data.data.data)
      } catch (error) {
        alert('error while fetching data')
      }
      
      
    }
    fetchData();
  },[]);

  
  
  return (
    <div className="App">
      <h1>Product Management</h1>
      {data && <Pagination data={data}/>}
      <Stats/>
      {barchartData && <Barchart barchartData={barchartData}/>}
      {piechartData && <Piechart piechartData = {piechartData}/>}
    </div>
  );
}

export default App;
