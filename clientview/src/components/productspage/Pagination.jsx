import React, { useState } from 'react';
import './pagination.css'
import Searchbar from '../searchbar/Searchbar';
import axios from 'axios';

export default function Pagination({ data }) {
    const [tablerecords, setTableRecords] = useState(data);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [tableData, setTableData] = useState(Object.values(tablerecords));
    const [month, setMonth]= useState(3);
  const renderTableRows = () => {
    const rows = [];
    const endIndex = Math.min(index + itemsPerPage, tableData.length);
    for (let i = index; i < endIndex; i++) {
      rows.push(
        <tr key={tableData[i].id}>
          <td className='tableCell'>{tableData[i].id}</td>
          <td className='tableCell'>{tableData[i].title}</td>
          <td className='tableCell'>{tableData[i].description}</td>
          <td className='tableCell'>{tableData[i].price}</td>
          <td className='tableCell'>{tableData[i].category}</td>
          <td className='tableCell'>{tableData[i].sold ? 'Yes' : 'No'}</td>
          <td>
            <img
              src={tableData[i].image}
              alt={tableData[i].title}
              style={{ width: '50px', height: '50px' }}
            />
          </td>
        </tr>
      );
    }
    return rows;
  };

  const handlePreviousPage = () => {
    if (index > 0) {
      setIndex(index - itemsPerPage);
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (index + itemsPerPage < tableData.length) {
      setIndex(index + itemsPerPage);
      setPage(page + 1);
    }
  };

  const fetchSuggestions = async(query,mon)=>{
    if(query === null){
        const result = await axios.get(`http://localhost:5000/api/products/search/?month=${mon}`);
        await setTableRecords(result.data);
        //console.log(result.data)
        setTableData(Object.values(tablerecords));
        const dateOfSale = new Date(result.data[0].dateOfSale);
        const monthVal = dateOfSale.getMonth() + 1;
        setMonth(monthVal);
    }else{
        console.log(query);
        const result = await axios.get(`http://localhost:5000/api/products/search/`,{
            params: {
              month: month,
              search: query
            }
          });
          await setTableRecords(result.data);
        //console.log(result);
        setTableData(Object.values(tablerecords));
    }
  }

  const setSuggestions = async(e)=>{
    const monthValue = e.target.value
    setMonth(month);
    
    fetchSuggestions(null, monthValue);
  }
  //console.log(month)
  return (
    <div className="RecordsContainer">
      <div className="queries">
        <div className="querySearch">
            <Searchbar
                placeholder="Search Product, Price"
                fetchSuggestions={fetchSuggestions}
                dataKey={"null"}
                customLoading={<>Loading Products...</>}
                onSelect={(res)=> console.log(res)}
        
                onChange={(e)=>{}}
                onBlur={(e)=>{}}
                onFocus={(e)=>{}}
                customStyles
            />
        </div>
        <select name="" onChange={(e)=>{setMonth(e.target.value); setSuggestions(e);}} className='MonthSelection' value={month} id="">
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
      <div className="tableRecBody">
      <table className="records">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody className="tableRecBody">{renderTableRows()}</tbody>
      </table>
      </div>
      <div className="pagination">
        <span className="pageInfo">Page: {page}</span>
        <div className="pageTraversal">
          <button
            className="traversalBtn"
            onClick={handlePreviousPage}
            disabled={index === 0}
          >
            Previous
          </button>
          <button
            className="traversalBtn"
            onClick={handleNextPage}
            disabled={index + itemsPerPage >= tableData.length}
          >
            Next
          </button>
        </div>
        <span className="pageInfo">Per page: {itemsPerPage}</span>
      </div>
    </div>
  );
}
