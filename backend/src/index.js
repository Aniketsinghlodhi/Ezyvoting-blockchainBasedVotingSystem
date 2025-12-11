require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;

// Connect Mongo
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ezyvoting')
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo connection error', err));

// Simple route
app.get('/', (req, res) => res.json({ ok: true, name: 'EzyVoting Backend' }));

// Mount blockchain routes
const blockchainRouter = require('./routes/blockchain');
app.use('/api/blockchain', blockchainRouter);

// Mount auth routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
