require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const API = require('./models/API');

connectDB().then(async () => {
  const categories = await API.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  console.log(categories);
  process.exit();
});
