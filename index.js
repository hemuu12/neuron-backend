const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
require("dotenv").config()
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(process.env.mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// Define Schema and Model
const dataSchema = new mongoose.Schema({
  // Define your schema fields here
  name: String,
  age: Number,
});
const Data = mongoose.model('Data', dataSchema);

// API to add new data
app.post('/api/data/add', async (req, res) => {
  try {
    const newData = new Data(req.body);
    await newData.save();
    res.status(201).send('Data added successfully');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// API to update data
app.put('/api/data/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Data.findByIdAndUpdate(id, req.body);
    res.status(200).send('Data updated successfully');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// API to delete
app.delete('/api/data/delete/:id', async (req, res) => {
  try {
    const { id } = req.body;
    await Data.findByIdAndDelete(id);
    res.status(200).send('Data deleted successfully');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// API to get count
app.get('/api/data/count', (req, res) => {
  res.json({ addCount, updateCount });
});

// API to get all data
app.get('/api/data', async (req, res) => {
  try {
    const allData = await Data.find();
    res.json(allData);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
