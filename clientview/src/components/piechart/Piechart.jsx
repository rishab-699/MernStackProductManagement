import { PieChart } from '@mui/x-charts'
import React, { useState, useEffect } from 'react'
import axios from 'axios';

export default function Piechart({piechartData,
    pieChartByMonth
}) {
    const[pieValueData, setPieValueData] = useState(piechartData);
  const [pieChartData, setPieChartData] = useState(piechartData)
  const [month, setMonth] = useState(1);
    //console.log(piechartData);
  useEffect(() => {
    if (pieValueData) {
      let pieData = [];
      pieValueData.map((item, index)=>{
        pieData.push({
            id: index,
            value: item.count,
            label: item._id
        })
      })
      setPieChartData(pieData);
      
    }
  }, [pieValueData]);
  const setPieMonth= async(curMonth)=>{
    //console.log(curMonth);
    try {
        const result = await axios.get(`http://localhost:5000/api/products/piechart/?month=${curMonth}`);
        //console.log(result.data);
        setPieValueData(result.data);
    } catch (error) {
        alert('something went wrong');
    }
  }
  //console.log(pieChartData);
  return (
    <div>
        <div className="query">
        <select name="" onChange={(e)=>{setPieMonth(e.target.value);}} className='MonthSelection' value={month} id="">
          <option value="1">Jan</option>
          <option value="2">Feb</option>
          <option value="3">Mar</option>
          <option value="4">Apr</option>
          <option value="5">May</option>
          <option value="6">Jun</option>
          <option value="7">Jul</option>
          <option value="8">Aug</option>
          <option value="9">Sep</option>
          <option value="10">Oct</option>
          <option value="11">Nov</option>
          <option value="12">Dec</option>
        </select>
        </div>
      
        <PieChart
            series={[
                {
                data: pieChartData,
                },
            ]}
            width={500}
            height={200}
        />
    </div>
  )
}
