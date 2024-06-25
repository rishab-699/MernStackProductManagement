const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoute = require('./productRoute');
const axios = require('axios');

const app = express();
dotenv.config();
const dbname = 'productsmanagement';

mongoose.connect(process.env.MONGO_URL,{dbName:dbname}).then(console.log('connected to mongoose')).catch((err)=> console.log(err));

app.use(cors());
app.use('/api/products/', productRoute);


const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log('Server Started')
})

