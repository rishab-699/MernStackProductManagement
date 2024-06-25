const express = require('express');
const router = express.Router();
const axios = require('axios');
const products = require('./module/product');

const addData = async()=>{
    const fetchData = async () => {
        try {
          const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
          return response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
          return [];
        }
      };
      const data = await fetchData();
      console.log(data.length);
      if(data.length>0){
      await products.insertMany(data).then(res.status(200).json('data Inserted Successfully')).catch((err)=> res.status(500).json('Internal Server Error', err));
      console.log('data Inserted Successfully');
      }else{
        console.log('data not fetched');
      }

}

const getStats = async(month)=>{
    console.log('getstats:', month);
    try {
        const results = await products.aggregate([
          {
            $match: {
              $expr: {
                $eq: [{ $month: { $toDate: "$dateOfSale" } }, month]
              }
            }
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$price" },
              totalItemsSold: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
              totalItemsNotSold: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } }
            }
          }
        ]);
        console.log(results);
        if (results.length > 0) {
            const { totalSales, totalItemsSold, totalItemsNotSold } = results[0];
            return {
              totalSales,
              totalItemsSold,
              totalItemsNotSold
            };
          } else {
            return {
              totalSales: 0,
              totalItemsSold: 0,
              totalItemsNotSold: 0
            };
          }
        } catch (error) {
          console.error('Error aggregating sales data:', error);
          throw error;
        }
}

const getpieChart = async(month)=>{
    try{
      if(month === null){
        console.log(month)
        const pie = await products.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ])
        return pie;
      }
      else{
        const pie = await products.aggregate([
          {
            $match: {
              $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
            }
          },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ])
        return pie;
      }
        
    }catch (error) {
          console.error('Error aggregating sales data:', error);
          throw error;
        }
}

const getBarChart = async(month)=>{
  try {
    const result = await products.aggregate([{
      $bucket: {
        groupBy: "$price", 
        boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, Infinity],
        default: "Other",
        output: {
          count: { $sum: 1 }
        }
      }
    }])

    return result
  
  } catch (error) {
    return false;
  }
}

router.get('/barchart/?',async(req,res)=>{
  const month = req.query.month;
  try {
    const response = await getBarChart(month);
    if(response !== false){
      res.status(200).json(response);
    }else{
      res.status(501).json('Error in fetching data');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal Server Error', error)
  }
})

router.get('/piechart/?',async(req,res)=>{
  const month = req.query.month;
  console.log(month);
  try {
    const response = await getpieChart(month);
    if(response !== false){
      res.status(200).json(response);
    }else{
      res.status(501).json('Error in fetching data');
    }
  } catch (error) {
    console.log('error: ',error)
    res.status(200).json(error)
  }
})

router.get('/',async(req,res)=>{
    try {
        let productData = await products.find({$expr: { $eq: [{ $month: "$dateOfSale" }, 3] } });
        if(productData.length == 0){
            await addData();
            productData = await products.find().limit(5);
        }
        let barchartData = await getBarChart();
        let PieChartData = await getpieChart(null);
        productData.push(barchartData)
        const homeData = {
          'data': productData,
          'barChart': barchartData,
          'pieChart': PieChartData
        }
        res.status(200).json(homeData);
        
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
})
router.get('/stats/?',async(req,res)=>{
  const month = parseInt(req.query.month);
  console.log('stats:', month)
  try {
      let productData = await getStats(month);
      res.status(200).json(productData);
      
  } catch (error) {
      res.status(500).json('Internal Server Error')
  }
})

router.get('/search/',async(req,res)=>{
  const month = req.query.month;
  const search = req.query.search || null;
  console.log(search);
  console.log(req.params);
  try {
    let result;
    if(search !== null){
      const searchAsNumber = parseFloat(search);
      const isNumber = !isNaN(searchAsNumber);
      const query = {
        $or: [
          { 'title': { $regex: new RegExp(search, 'i') } },
          { 'description': { $regex: new RegExp(search, 'i') } }
        ]
      };
      if (isNumber) {
        query.$or.push({ 'price': { $lte: searchAsNumber } });
      }
      result = await products.find(query);
    }else{
    result = await products.find({$expr: { $eq: [{ $month: "$dateOfSale" }, month] } })
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json('Internal Server Error')
    console.log(error)
  }
})

module.exports = router;