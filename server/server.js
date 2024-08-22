
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/transactions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => console.log('Error connecting to MongoDB', err));

const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  sold: Boolean,
  dateOfSale: Date,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.get('/api/init', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.insertMany(response.data);
    res.send({ message: 'Database initialized with data' });
  } catch (error) {
    res.status(500).send({ message: 'Error initializing database', error });
  }
});

app.get('/api/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;

  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const query = {
    dateOfSale: { $gte: startDate, $lt: endDate },
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  };

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions');
  }
});

app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const totalSale = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: null,
          totalSale: { $sum: '$price' },
          totalSoldItems: { $sum: { $cond: ['$sold', 1, 0] } },
          totalNotSoldItems: { $sum: { $cond: ['$sold', 0, 1] } }
        }
      }
    ]);

    res.json(totalSale[0] || { totalSale: 0, totalSoldItems: 0, totalNotSoldItems: 0 });
  } catch (error) {
    res.status(500).send('Error fetching statistics');
  }
});

app.get('/api/bar-chart', async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity },
  ];

  try {
    const result = await Promise.all(priceRanges.map(async (range) => {
      const count = await Transaction.countDocuments({
        dateOfSale: { $gte: startDate, $lt: endDate },
        price: { $gte: range.min, $lt: range.max }
      });
      return { range: range.range, count };
    }));

    res.json(result);
  } catch (error) {
    res.status(500).send('Error fetching bar chart data');
  }
});

app.get('/api/pie-chart', async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json(categories);
  } catch (error) {
    res.status(500).send('Error fetching pie chart data');
  }
});

app.get('/api/combined', async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lt: endDate } });

    const statistics = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: null,
          totalSale: { $sum: '$price' },
          totalSoldItems: { $sum: { $cond: ['$sold', 1, 0] } },
          totalNotSoldItems: { $sum: { $cond: ['$sold', 0, 1] } }
        }
      }
    ]);

    const barChart = await Promise.all(priceRanges.map(async (range) => {
      const count = await Transaction.countDocuments({
        dateOfSale: { $gte: startDate, $lt: endDate },
        price: { $gte: range.min, $lt: range.max }
      });
      return { range: range.range, count };
    }));

    const pieChart = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({ transactions, statistics: statistics[0], barChart, pieChart });
  } catch (error) {
    res.status(500).send('Error fetching combined data');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
